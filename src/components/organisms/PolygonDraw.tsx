import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useMemo } from 'react';

export default function PolygonDraw() {
    const polygonVertices = useSelector((state: RootState) => state.appState.polygonVertices);
    const polygonClosed = useSelector((state: RootState) => state.appState.polygonClosed);

    const polygonGeoJSON = useMemo(() => {
        if (polygonVertices.length < 2) return null;

        const coordinates = polygonVertices.map(v => [v.lng, v.lat]);

        // If polygon is closed or has 3+ vertices, render as polygon fill
        if (polygonVertices.length >= 3) {
            const ring = [...coordinates, coordinates[0]]; // Close the ring
            return {
                type: 'FeatureCollection' as const,
                features: [
                    {
                        type: 'Feature' as const,
                        geometry: {
                            type: 'Polygon' as const,
                            coordinates: [ring],
                        },
                        properties: {},
                    },
                ],
            };
        }

        // 2 vertices: render as a line
        return {
            type: 'FeatureCollection' as const,
            features: [
                {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'LineString' as const,
                        coordinates,
                    },
                    properties: {},
                },
            ],
        };
    }, [polygonVertices]);

    const vertexGeoJSON = useMemo(() => {
        return {
            type: 'FeatureCollection' as const,
            features: polygonVertices.map((v, i) => ({
                type: 'Feature' as const,
                geometry: {
                    type: 'Point' as const,
                    coordinates: [v.lng, v.lat],
                },
                properties: { index: i },
            })),
        };
    }, [polygonVertices]);

    if (polygonVertices.length === 0) return null;

    return (
        <>
            {/* Polygon fill / line */}
            {polygonGeoJSON && (
                <Source id="polygon-draw" type="geojson" data={polygonGeoJSON}>
                    {polygonVertices.length >= 3 && (
                        <Layer
                            id="polygon-fill"
                            type="fill"
                            paint={{
                                'fill-color': polygonClosed ? '#00A8E8' : '#00A8E8',
                                'fill-opacity': polygonClosed ? 0.25 : 0.15,
                            }}
                        />
                    )}
                    <Layer
                        id="polygon-outline"
                        type="line"
                        paint={{
                            'line-color': '#00A8E8',
                            'line-width': 2,
                            'line-dasharray': polygonClosed ? [1] : [2, 2],
                        }}
                    />
                </Source>
            )}

            {/* Vertex markers */}
            <Source id="polygon-vertices" type="geojson" data={vertexGeoJSON}>
                <Layer
                    id="polygon-vertex-points"
                    type="circle"
                    paint={{
                        'circle-radius': 6,
                        'circle-color': '#ffffff',
                        'circle-stroke-color': '#00A8E8',
                        'circle-stroke-width': 2,
                    }}
                />
            </Source>
        </>
    );
}
