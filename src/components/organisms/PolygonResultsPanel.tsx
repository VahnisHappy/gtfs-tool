import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { clearPolygon, setStationCount, setPlannedStations, clearStationPlan, setMode, setStationPlanRoutePath, setSelectedPOIs } from '../../store/slices/appSlice';
import { MapActions, StopActions } from '../../store/actions';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { searchExternalPOIs, POI_CATEGORIES } from '../../services/mapboxPOI';
import type { ExternalPOI } from '../../services/mapboxPOI';
import { planStations, findOptimalStationCount } from '../../services/stationPlanner';
import { direction } from '../../services/useMapInteractions';
import { createStop } from '../../factory';

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

    const [allPOIs, setAllPOIs] = useState<ExternalPOI[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

            // Auto-determine optimal station count via SIC
            const optimalCount = findOptimalStationCount(
                pointA, pointB, selectedPOIs, path,
            );
            dispatch(setStationCount(optimalCount));

            // Plan stations using only selected POIs
            const stations = planStations(
                pointA, pointB, optimalCount, selectedPOIs, path,
            );
            dispatch(setPlannedStations(stations));
        } catch (err) {
            console.error('Failed to calculate stations:', err);
            const optimalCount = findOptimalStationCount(
                pointA, pointB, selectedPOIs,
            );
            dispatch(setStationCount(optimalCount));
            const stations = planStations(
                pointA, pointB, optimalCount, selectedPOIs,
            );
            dispatch(setPlannedStations(stations));
        } finally {
            setCalculating(false);
        }
    };

    const handleSaveAllStops = () => {
        for (const station of plannedStations) {
            const stop = createStop(station.position);
            dispatch(StopActions.addStop(stop));
        }
        dispatch(clearStationPlan());
    };

    const handleClearPlan = () => {
        dispatch(clearStationPlan());
    };

    const canCalculate = pointA && pointB && selectedPOIs.length > 0 && !calculating;

    // Categories that have POIs in the polygon
    const availableCategories = POI_CATEGORIES.filter(c => categoryCounts.has(c.id));

    return (
        <aside
            className={`fixed right-0 top-0 h-screen w-[380px] shadow-xl z-50 overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex flex-col h-full bg-[#F5F7F9]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">POI & Station Planner</h3>
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
                            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                ① Select POI Categories
                            </h4>
                            {availableCategories.length > 0 && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={selectAllCategories}
                                        className="text-xs text-[#00A8E8] hover:underline"
                                    >
                                        All
                                    </button>
                                    <span className="text-xs text-gray-300">|</span>
                                    <button
                                        onClick={deselectAllCategories}
                                        className="text-xs text-gray-400 hover:underline"
                                    >
                                        None
                                    </button>
                                </div>
                            )}
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A8E8]"></div>
                                <span className="ml-2 text-sm text-gray-500">Searching POIs...</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 mb-2">
                                ⚠️ {error}
                            </div>
                        )}

                        {!loading && !error && allPOIs.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">No important places found in this area</p>
                        )}

                        {!loading && availableCategories.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs text-gray-400 mb-2">
                                    {selectedPOIs.length} of {allPOIs.length} places selected
                                </p>
                                {availableCategories.map(cat => {
                                    const isSelected = selectedCategories.has(cat.id);
                                    const count = categoryCounts.get(cat.id) || 0;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all ${isSelected
                                                ? 'bg-white border-l-4 shadow-sm'
                                                : 'bg-white/50 border-gray-100 hover:border-gray-300'
                                                }`}
                                            style={isSelected ? { borderLeftColor: cat.color } : {}}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${isSelected ? 'text-white' : 'bg-gray-100'
                                                    }`}
                                                style={isSelected ? { backgroundColor: cat.color } : {}}
                                            >
                                                {isSelected ? '✓' : ''}
                                            </div>
                                            <span className={`flex-1 text-left font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                                                {cat.label}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-50 text-[#00A8E8] font-semibold' : 'bg-gray-100 text-gray-400'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Selected POI details (collapsible list) */}
                    {selectedPOIs.length > 0 && (
                        <div className="p-4 border-b border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                📌 Selected Places ({selectedPOIs.length})
                            </h4>
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

                    {/* Step 2: Set Route + Calculate */}
                    <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                            ② Set Route & Plan Stations
                        </h4>

                        {/* Point A */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${pointA ? 'bg-green-500' : 'bg-gray-300'
                                }`}>A</div>
                            <div className="flex-1 min-w-0">
                                {pointA ? (
                                    <p className="text-sm text-gray-700 truncate">
                                        {pointA.lat.toFixed(5)}, {pointA.lng.toFixed(5)}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400">Not set</p>
                                )}
                            </div>
                            <button
                                onClick={handlePickA}
                                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${mode === 'pickA'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {mode === 'pickA' ? 'Click map...' : pointA ? 'Change' : 'Set'}
                            </button>
                        </div>

                        {/* Point B */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${pointB ? 'bg-red-500' : 'bg-gray-300'
                                }`}>B</div>
                            <div className="flex-1 min-w-0">
                                {pointB ? (
                                    <p className="text-sm text-gray-700 truncate">
                                        {pointB.lat.toFixed(5)}, {pointB.lng.toFixed(5)}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400">Not set</p>
                                )}
                            </div>
                            <button
                                onClick={handlePickB}
                                className={`px-3 py-1 text-xs rounded font-medium transition-colors ${mode === 'pickB'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {mode === 'pickB' ? 'Click map...' : pointB ? 'Change' : 'Set'}
                            </button>
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={handleCalculate}
                            disabled={!canCalculate}
                            className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors ${canCalculate
                                ? 'bg-[#00A8E8] text-white hover:bg-[#009AD6]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {calculating
                                ? 'Fetching route & optimizing...'
                                : `Plan Stations (${selectedPOIs.length} POI${selectedPOIs.length !== 1 ? 's' : ''})`}
                        </button>

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

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={handleSaveAllStops}
                                        className="flex-1 py-2 bg-green-500 text-white text-sm rounded-md font-medium hover:bg-green-600 transition-colors"
                                    >
                                        Save as Stops
                                    </button>
                                    <button
                                        onClick={handleClearPlan}
                                        className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-md font-medium hover:bg-red-100 border border-red-200 transition-colors"
                                    >
                                        Clear
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
