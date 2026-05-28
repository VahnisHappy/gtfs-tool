import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import type { RootState } from "../../store";
import { openStopDetail } from "../../store/slices/appSlice";
import { StopActions, MapActions, RouteActions } from "../../store/actions";
import ButtonAction from "../atoms/ButtonAction";
import StopContentDetail from "../organisms/StopContentDetail";
import EditDeleteButton from "../molecules/EditDeleteButton";
import StopCard from "../molecules/StopCard";
import { stopsApi, ApiError } from "../../services/api";
import PolygonToolbar from "../molecules/PolygonToolbar";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    const routes = useSelector((state: RootState) => state.routeState.data);
    const selectedStopIndex = useSelector((state: RootState) => state.stopState.selectedIndex);
    const selectedStop = useSelector((state: RootState) => state.appState.selectedStop);
    const dispatch = useDispatch();
    const stopListRef = useRef<HTMLDivElement>(null);


    const handleNewStop = () => {
        dispatch(StopActions.selectStop(null));
        // Open detail panel in 'new' mode, which also sets mode to 'mark'
        dispatch(openStopDetail({
            mode: 'new',
            lat: null,
            lng: null
        }));
    }

    const handleEditStop = () => {
        if (selectedStopIndex === null) return;
        const stop = stops[selectedStopIndex];
        dispatch(openStopDetail({
            mode: 'edit',
            ...stop,
            stopIndex: selectedStopIndex
        }));
    }

    const handleDeleteStop = async () => {
        if (selectedStopIndex === null) return;

        // Confirm deletion
        const stop = stops[selectedStopIndex];
        if (window.confirm(`Are you sure you want to delete "stop: ${stop.name.value}"?`)) {
            try {
                // Delete from backend (cascades to routes)
                const result = await stopsApi.delete(stop.id.value) as {
                    deletedRouteIds?: string[];
                    updatedRouteIds?: string[];
                };
                console.log('Stop deleted from backend successfully');

                // Remove from local state
                dispatch(StopActions.removeStopByIndex(selectedStopIndex));
                dispatch(StopActions.selectStop(null));

                // Remove auto-deleted routes from local state
                if (result.deletedRouteIds && result.deletedRouteIds.length > 0) {
                    const currentRoutes = routes.filter(
                        r => !result.deletedRouteIds!.includes(r.id.value)
                    );
                    dispatch(RouteActions.setRoutes(currentRoutes));
                }

                // Update routes that had the stop removed: filter the deleted stop index
                // from their stopIndexes, and adjust remaining indices for the removed stop
                if (result.updatedRouteIds && result.updatedRouteIds.length > 0) {
                    const updatedRoutes = routes.map(r => {
                        if (!result.updatedRouteIds!.includes(r.id.value)) return r;
                        return {
                            ...r,
                            stopIndexes: r.stopIndexes
                                .filter(idx => idx !== selectedStopIndex)
                                .map(idx => idx > selectedStopIndex ? idx - 1 : idx),
                        };
                    });
                    dispatch(RouteActions.setRoutes(updatedRoutes));
                }
            } catch (err) {
                console.error('Failed to delete stop:', err);

                if (err instanceof ApiError) {
                    alert(`Failed to delete stop: ${err.message}`);
                } else {
                    alert('An unexpected error occurred. Please try again.');
                }
            }
        }
    }

    const handleSelectStop = (index: number) => {
        // Toggle selection: if clicking the same stop, deselect it
        const newSelection = selectedStopIndex === index ? null : index;
        dispatch(StopActions.selectStop(newSelection));

        // Fly to the selected stop
        if (newSelection !== null) {
            const stop = stops[newSelection];
            dispatch(MapActions.flyToLocation({ lat: stop.lat, lng: stop.lng, zoom: 16 }));
        }
    }

    return ( // TODO Can search stops by name or id (searchbox)
        
        <div className="flex h-full w-full">
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full"
                ref={stopListRef}
            >
                <div className="flex items-center justify-between pb-2 border-b">
                    <PolygonToolbar />
                    <ButtonAction label="new stop" onClick={handleNewStop} />

                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-2 flex justify-between">
                        <h3 className="font-semibold">stop list ({stops.length})</h3>
                            <EditDeleteButton onEdit={handleEditStop} onDelete={handleDeleteStop} disabled={selectedStopIndex === null} isEditing={selectedStop?.mode === 'edit'} />
                    </div>
                    {stops.length === 0 ? (
                        <p className="text-gray-500 text-sm px-4">no stops created yet. click "new stop" to add one.</p>
                    ) : (
                        <ul className="space-y-0">
                            {stops.map((stop, index) => (
                                <StopCard
                                    key={stop.id.value}
                                    stop={stop}
                                    index={index}
                                    isSelected={selectedStopIndex === index}
                                    onSelect={() => handleSelectStop(index)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <StopContentDetail />
        </div>
    );
}