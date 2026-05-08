import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { clearPolygon, setStationCount, setPlannedStations, clearStationPlan, setMode, setStationPlanRoutePath, setSelectedPOIs } from '../../store/slices/appSlice';
import { MapActions, StopActions, RouteActions } from '../../store/actions';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { searchExternalPOIs, POI_CATEGORIES } from '../../services/mapboxPOI';
import type { ExternalPOI } from '../../services/mapboxPOI';
import { planStations, findOptimalStationCount } from '../../services/stationPlanner';
import CategoryList from '../molecules/CategoryList';
import { direction } from '../../services/useMapInteractions';
import { stopsApi, routesApi } from '../../services/api';
import type { Stop, Route } from '../../types';
import RouteStopBySIC from '../molecules/RouteStopBySIC';

export default function PolygonResultsPanel() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.appState.isPolygonPanelOpen);
    const polygonVertices = useSelector((state: RootState) => state.appState.polygonVertices);
    const polygonClosed = useSelector((state: RootState) => state.appState.polygonClosed);
    const pointA = useSelector((state: RootState) => state.appState.stationPlanPointA);
    const pointB = useSelector((state: RootState) => state.appState.stationPlanPointB);
    const plannedStations = useSelector((state: RootState) => state.appState.plannedStations);
    const selectedPOIs = useSelector((state: RootState) => state.appState.selectedPOIs);
    const mode = useSelector((state: RootState) => state.appState.mode);
    const stationPlanRoutePath = useSelector((state: RootState) => state.appState.stationPlanRoutePath);
    const stops = useSelector((state: RootState) => state.stopState.data);
    const routes = useSelector((state: RootState) => state.routeState.data);

    const [allPOIs, setAllPOIs] = useState<ExternalPOI[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customStationCount, setCustomStationCount] = useState<number | null>(null);

    // Count POIs per category
    const categoryCounts = useMemo(() => {
        const counts = new Map<string, number>();
        for (const poi of allPOIs) {
            counts.set(poi.category, (counts.get(poi.category) || 0) + 1);
        }
        return counts;
    }, [allPOIs]);

    // Update selected POIs in Redux when categories change
    const updateSelectedPOIs = useCallback((pois: ExternalPOI[], categories: Set<string>) => {
        const filtered = pois.filter(poi => categories.has(poi.category));
        dispatch(setSelectedPOIs(filtered));
    }, [dispatch]);

    // Fetch external POIs when polygon is closed
    useEffect(() => {
        if (!polygonClosed || polygonVertices.length < 3) {
            setAllPOIs([]);
            setSelectedCategories(new Set());
            dispatch(setSelectedPOIs([]));
            return;
        }

        const fetchPOIs = async () => {
            setLoading(true);
            setError(null);
            try {
                const pois = await searchExternalPOIs(polygonVertices);
                setAllPOIs(pois);
                setSelectedCategories(new Set());
                dispatch(setSelectedPOIs([]));
            } catch (err: any) {
                console.error('Failed to fetch POIs:', err);
                setError(err.message || 'Failed to search for POIs');
            } finally {
                setLoading(false);
            }
        };

        fetchPOIs();
    }, [polygonClosed, polygonVertices, dispatch]);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            updateSelectedPOIs(allPOIs, next);
            return next;
        });
    };

    const selectAllCategories = () => {
        const all = new Set(POI_CATEGORIES.map(c => c.id).filter(id => categoryCounts.has(id)));
        setSelectedCategories(all);
        updateSelectedPOIs(allPOIs, all);
    };

    const deselectAllCategories = () => {
        setSelectedCategories(new Set());
        dispatch(setSelectedPOIs([]));
    };

    const handleFlyTo = (lon: number, lat: number) => {
        dispatch(MapActions.flyToLocation({ lat, lng: lon, zoom: 16 }));
    };

    const handleClose = () => {
        dispatch(clearPolygon());
    };

    const handlePickA = () => {
        dispatch(setMode('pickA'));
    };

    const handlePickB = () => {
        dispatch(setMode('pickB'));
    };

    const handleCalculate = async () => {
        if (!pointA || !pointB || selectedPOIs.length === 0) return;
        setCalculating(true);
        try {
            // Fetch road route
            const path = await direction([pointA, pointB]);
            dispatch(setStationPlanRoutePath(path));

            // Use custom count if specified, otherwise auto-determine via SIC
            const count = customStationCount ?? findOptimalStationCount(
                pointA, pointB, selectedPOIs, path,
            );
            dispatch(setStationCount(count));

            // Plan stations using only selected POIs
            const stations = planStations(
                pointA, pointB, count, selectedPOIs, path,
            );
            dispatch(setPlannedStations(stations));
        } catch (err) {
            console.error('Failed to calculate stations:', err);
            const count = customStationCount ?? findOptimalStationCount(
                pointA, pointB, selectedPOIs,
            );
            dispatch(setStationCount(count));
            const stations = planStations(
                pointA, pointB, count, selectedPOIs,
            );
            dispatch(setPlannedStations(stations));
        } finally {
            setCalculating(false);
        }
    };

    const [saving, setSaving] = useState(false);
    const [idPrefix, setIdPrefix] = useState('station');
    const [namePrefix, setNamePrefix] = useState('station');
    const [saveRoute, setSaveRoute] = useState(true);
    const [routeId, setRouteId] = useState('route_001');
    const [routeName, setRouteName] = useState('Route 1');

    const handleSaveAllStops = async () => {
        setSaving(true);
        const existingStopCount = stops.length;
        const savedStopIds: string[] = [];

        try {
            // 1. Save all planned stations as stops
            for (let i = 0; i < plannedStations.length; i++) {
                const station = plannedStations[i];
                const stopNumber = existingStopCount + i + 1;
                const stopId = `${idPrefix}_${String(stopNumber).padStart(3, '0')}`;
                const stopName = `${namePrefix} ${stopNumber}`;

                // Save to backend
                await stopsApi.create({
                    stop_id: stopId,
                    stop_name: stopName,
                    stop_lat: station.position.lat,
                    stop_lon: station.position.lng,
                });

                // Add to Redux with filled fields
                const stop: Stop = {
                    id: { value: stopId, error: undefined },
                    name: { value: stopName, error: undefined },
                    lat: station.position.lat,
                    lng: station.position.lng,
                };
                dispatch(StopActions.addStop(stop));
                savedStopIds.push(stopId);
            }

            // 2. Optionally save the route path with linked stops
            if (saveRoute && plannedStations.length >= 2 && stationPlanRoutePath.length >= 2) {
                // Build stop indexes referencing the newly added stops
                const newStopIndexes = savedStopIds.map((_, i) => existingStopCount + i);

                // Extract road-following path between SIC stations.
                // For each station, find the nearest point index on the full road path,
                // then stitch together the road segments between consecutive stations.
                const distSq = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) =>
                    (a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2;

                // Find the closest road path index for each station (in order)
                let searchStart = 0;
                const snapIndices: number[] = [];
                for (const station of plannedStations) {
                    let bestIdx = searchStart;
                    let bestDist = Infinity;
                    for (let j = searchStart; j < stationPlanRoutePath.length; j++) {
                        const d = distSq(station.position, stationPlanRoutePath[j]);
                        if (d < bestDist) {
                            bestDist = d;
                            bestIdx = j;
                        }
                    }
                    snapIndices.push(bestIdx);
                    searchStart = bestIdx; // next station must be further along the path
                }

                // Build the road-following path by stitching road segments
                const routePath: { lat: number; lng: number }[] = [];
                for (let i = 0; i < snapIndices.length; i++) {
                    const startIdx = i === 0 ? snapIndices[0] : snapIndices[i - 1] + 1;
                    const endIdx = snapIndices[i];
                    for (let j = startIdx; j <= endIdx; j++) {
                        routePath.push(stationPlanRoutePath[j]);
                    }
                }

                // Save route to backend
                await routesApi.create({
                    route_id: routeId,
                    route_short_name: routeName,
                    route_type: 3, // Bus
                    route_color: '#00A8E8',
                    route_path: routePath,
                });

                // Add route to Redux
                const route: Route = {
                    id: { value: routeId, error: false },
                    name: { value: routeName, error: false },
                    routeType: 3,
                    color: '#00A8E8',
                    stopIndexes: newStopIndexes,
                    stopIds: savedStopIds,
                    path: routePath,
                    edit: false,
                    isNew: false,
                };
                dispatch(RouteActions.addRoute(route));
            }

            dispatch(clearStationPlan());
        } catch (err) {
            console.error('Failed to save stations:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleClearPlan = () => {
        dispatch(clearStationPlan());
    };

    const canCalculate = !!(pointA && pointB && selectedPOIs.length > 0 && !calculating);

    const availableCategories = POI_CATEGORIES.filter(c => categoryCounts.has(c.id));

    return (
        <aside
            className={`fixed right-0 top-0 h-screen w-[380px] shadow-xl z-50 overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex flex-col h-full bg-[#F5F7F9]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">POI</h3>
                    <button onClick={handleClose} className="p-1 rounded hover:bg-gray-200 transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Step 1: Category Selection */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 > select POI Categories </h4>
                            {availableCategories.length > 0 && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={selectAllCategories}
                                        className="text-xs text-[#00A8E8] hover:underline"
                                    >
                                        all
                                    </button>
                                    <span className="text-xs text-gray-300">|</span>
                                    <button
                                        onClick={deselectAllCategories}
                                        className="text-xs text-gray-400 hover:underline"
                                    >
                                        none
                                    </button>
                                </div>
                            )}
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A8E8]"></div>
                                <span className="ml-2 text-sm text-gray-500">searching POIs...</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 mb-2">
                                {error}
                            </div>
                        )}

                        {!loading && !error && allPOIs.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">no important places found in this area</p>
                        )}

                        {!loading && availableCategories.length > 0 && (
                            <CategoryList
                                selectedCount={selectedPOIs.length}
                                totalCount={allPOIs.length}
                                availableCategories={availableCategories}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                categoryCounts={categoryCounts}
                            />
                        )}
                    </div>

                    {/* Selected POI details (collapsible list) */}
                    {selectedPOIs.length > 0 && (
                        <div className="p-4 border-b border-gray-200">
                            <h4> selected places ({selectedPOIs.length}) </h4>
                            <div className="space-y-1 max-h-[140px] overflow-y-auto">
                                {selectedPOIs.map(poi => {
                                    const cat = POI_CATEGORIES.find(c => c.id === poi.category);
                                    return (
                                        <button
                                            key={poi.id}
                                            onClick={() => handleFlyTo(poi.coordinates[0], poi.coordinates[1])}
                                            className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-white transition-colors flex items-center gap-2"
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: cat?.color || '#999' }}
                                            ></span>
                                            <span className="text-gray-600 truncate">{poi.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="p-4">
                        <RouteStopBySIC
                            pointA={pointA}
                            pointB={pointB}
                            mode={mode}
                            calculating={calculating}
                            canCalculate={canCalculate}
                            selectedPOICount={selectedPOIs.length}
                            customStationCount={customStationCount}
                            onPickA={handlePickA}
                            onPickB={handlePickB}
                            onCalculate={handleCalculate}
                            onStationCountChange={setCustomStationCount}
                        />

                        {/* Planned Stations Results */}
                        {plannedStations.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">
                                    <span className="font-semibold text-gray-700">{plannedStations.length}</span> station{plannedStations.length !== 1 ? 's' : ''} optimized by SIC
                                </p>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {plannedStations.map((station) => (
                                        <div
                                            key={station.index}
                                            onClick={() => handleFlyTo(station.position.lng, station.position.lat)}
                                            className="p-2.5 bg-white rounded border border-gray-100 hover:border-[#00A8E8] cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 bg-[#00A8E8] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                    {station.index}
                                                </span>
                                                <span className="text-sm text-gray-700">
                                                    {station.position.lat.toFixed(5)}, {station.position.lng.toFixed(5)}
                                                </span>
                                            </div>
                                            {station.nearbyPOIs.length > 0 && (
                                                <div className="mt-1 pl-7">
                                                    {station.nearbyPOIs.slice(0, 3).map((poi, j) => (
                                                        <p key={j} className="text-xs text-gray-400 truncate">
                                                            {poi.category.split(' ')[0]} {poi.name} ({poi.distance}m)
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Customizable Stop ID & Name Prefix */}
                                <div className="mt-3 space-y-2">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Stop naming</p>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500 w-16 flex-shrink-0">ID prefix</label>
                                        <input
                                            type="text"
                                            value={idPrefix}
                                            onChange={(e) => setIdPrefix(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#00A8E8] bg-white"
                                            placeholder="station"
                                        />
                                        <span className="text-xs text-gray-400 whitespace-nowrap">→ {idPrefix}_001</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500 w-16 flex-shrink-0">name</label>
                                        <input
                                            type="text"
                                            value={namePrefix}
                                            onChange={(e) => setNamePrefix(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#00A8E8] bg-white"
                                            placeholder="Station"
                                        />
                                        <span className="text-xs text-gray-400 whitespace-nowrap">→ {namePrefix} 1</span>
                                    </div>
                                </div>

                                {/* Save Route Toggle + Route ID/Name */}
                                <div className="mt-3 space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={saveRoute}
                                            onChange={(e) => setSaveRoute(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#00A8E8] focus:ring-[#00A8E8]"
                                        />
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Also save route</span>
                                    </label>
                                    {saveRoute && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-gray-500 w-16 flex-shrink-0">route ID</label>
                                                <input
                                                    type="text"
                                                    value={routeId}
                                                    onChange={(e) => setRouteId(e.target.value)}
                                                    className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#00A8E8] bg-white"
                                                    placeholder="route_001"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-gray-500 w-16 flex-shrink-0">route name</label>
                                                <input
                                                    type="text"
                                                    value={routeName}
                                                    onChange={(e) => setRouteName(e.target.value)}
                                                    className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#00A8E8] bg-white"
                                                    placeholder="Route 1"
                                                />
                                            </div>
                                            <p className="text-[11px] text-gray-400">
                                                The road path between A → B will be saved as a route with {plannedStations.length} linked stop{plannedStations.length !== 1 ? 's' : ''}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleSaveAllStops}
                                        disabled={saving}
                                        className={`flex-1 py-2 text-white text-sm rounded-md font-medium transition-colors ${saving ? 'bg-green-400 cursor-wait' : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                    >
                                        {saving ? 'Saving...' : saveRoute ? 'Save Stops & Route' : 'Save as Stops'}
                                    </button>
                                    <button
                                        onClick={handleClearPlan}
                                        className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-md font-medium hover:bg-red-100 border border-red-200 transition-colors"
                                    >
                                        clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
