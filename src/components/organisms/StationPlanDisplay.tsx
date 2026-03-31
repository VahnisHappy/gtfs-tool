import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useMemo } from 'react';
import { POI_CATEGORIES } from '../../services/mapboxPOI';

export default function StationPlanDisplay() {
    const pointA = useSelector((state: RootState) => state.appState.stationPlanPointA);
    const pointB = useSelector((state: RootState) => state.appState.stationPlanPointB);
    const plannedStations = useSelector((state: RootState) => state.appState.plannedStations);
    const routePath = useSelector((state: RootState) => state.appState.stationPlanRoutePath);
    const selectedPOIs = useSelector((state: RootState) => state.appState.selectedPOIs);

    // Selected POIs as colored markers
    const poiGeoJSON = useMemo(() => {
        if (selectedPOIs.length === 0) return null;
        return {
            type: 'FeatureCollection' as const,
            features: selectedPOIs.map(poi => {
                const cat = POI_CATEGORIES.find(c => c.id === poi.category);
                return {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'Point' as const,
                        coordinates: poi.coordinates,
                    },
                    properties: {
                        name: poi.name,
                        category: poi.categoryLabel,
                        color: cat?.color || '#999999',
                    },
                };
            }),
        };
    }, [selectedPOIs]);

    // Route line: use actual road path if available, otherwise straight A→B line
    const lineGeoJSON = useMemo(() => {
        if (routePath.length >= 2) {
            return {
                type: 'FeatureCollection' as const,
                features: [{
                    type: 'Feature' as const,
                    geometry: {
                        type: 'LineString' as const,
                        coordinates: routePath.map(p => [p.lng, p.lat]),
                    },
                    properties: {},
                }],
            };
        }
        if (!pointA || !pointB) return null;
        return {
            type: 'FeatureCollection' as const,
            features: [{
                type: 'Feature' as const,
                geometry: {
                    type: 'LineString' as const,
                    coordinates: [[pointA.lng, pointA.lat], [pointB.lng, pointB.lat]],
                },
                properties: {},
            }],
        };
    }, [pointA, pointB, routePath]);

    // Anchor points A and B
    const anchorGeoJSON = useMemo(() => {
        const features: any[] = [];
        if (pointA) {
            features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [pointA.lng, pointA.lat] },
                properties: { label: 'A', color: '#22C55E' },
            });
        }
        if (pointB) {
            features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [pointB.lng, pointB.lat] },
                properties: { label: 'B', color: '#EF4444' },
            });
        }
        return { type: 'FeatureCollection' as const, features };
    }, [pointA, pointB]);

    // Calculated station positions
    const stationsGeoJSON = useMemo(() => {
        if (plannedStations.length === 0) return null;
        return {
            type: 'FeatureCollection' as const,
            features: plannedStations.map(s => ({
                type: 'Feature' as const,
                geometry: {
                    type: 'Point' as const,
                    coordinates: [s.position.lng, s.position.lat],
                },
                properties: { index: s.index, label: String(s.index) },
            })),
        };
    }, [plannedStations]);

    const hasAnything = pointA || pointB || plannedStations.length > 0 || selectedPOIs.length > 0;

    if (!hasAnything) return null;

    return (
        <>
            {/* Selected POI markers */}
            {poiGeoJSON && (
                <Source id="poi-markers" type="geojson" data={poiGeoJSON}>
                    <Layer
                        id="poi-marker-circles"
                        type="circle"
                        paint={{
                            'circle-radius': 6,
                            'circle-color': ['get', 'color'],
                            'circle-stroke-color': '#ffffff',
                            'circle-stroke-width': 2,
                            'circle-opacity': 0.9,
                        }}
                    />
                    <Layer
                        id="poi-marker-labels"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'name'],
                            'text-size': 10,
                            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
                            'text-offset': [0, 1.5],
                            'text-anchor': 'top',
                            'text-max-width': 10,
                        }}
                        paint={{
                            'text-color': '#374151',
                            'text-halo-color': '#ffffff',
                            'text-halo-width': 1,
                        }}
                    />
                </Source>
            )}

            {/* A-B route line */}
            {lineGeoJSON && (
                <Source id="station-plan-line" type="geojson" data={lineGeoJSON}>
                    <Layer
                        id="station-plan-line-layer"
                        type="line"
                        paint={{
                            'line-color': '#6B7280',
                            'line-width': 2,
                            'line-dasharray': [4, 3],
                        }}
                    />
                </Source>
            )}

            {/* Anchor points A & B */}
            {anchorGeoJSON.features.length > 0 && (
                <Source id="station-plan-anchors" type="geojson" data={anchorGeoJSON}>
                    <Layer
                        id="station-plan-anchor-circles"
                        type="circle"
                        paint={{
                            'circle-radius': 10,
                            'circle-color': ['get', 'color'],
                            'circle-stroke-color': '#ffffff',
                            'circle-stroke-width': 3,
                        }}
                    />
                    <Layer
                        id="station-plan-anchor-labels"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'label'],
                            'text-size': 12,
                            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
                            'text-allow-overlap': true,
                        }}
                        paint={{
                            'text-color': '#ffffff',
                        }}
                    />
                </Source>
            )}

            {/* Calculated stations */}
            {stationsGeoJSON && (
                <Source id="station-plan-stations" type="geojson" data={stationsGeoJSON}>
                    <Layer
                        id="station-plan-station-circles"
                        type="circle"
                        paint={{
                            'circle-radius': 8,
                            'circle-color': '#00A8E8',
                            'circle-stroke-color': '#ffffff',
                            'circle-stroke-width': 2,
                        }}
                    />
                    <Layer
                        id="station-plan-station-labels"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'label'],
                            'text-size': 10,
                            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
                            'text-allow-overlap': true,
                        }}
                        paint={{
                            'text-color': '#ffffff',
                        }}
                    />
                </Source>
            )}
        </>
    );
}
