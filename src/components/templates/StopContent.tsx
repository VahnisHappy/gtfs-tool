import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import type { RootState } from "../../store";
import { openStopDetail } from "../../store/slices/appSlice";
import { StopActions, MapActions } from "../../store/actions";
import ButtonAction from "../atoms/ButtonAction";
import StopContentDetail from "../organisms/StopContentDetail";
import EditDeleteButton from "../molecules/EditDeleteButton";
import StopCard from "../molecules/StopCard";
import { stopsApi, ApiError } from "../../services/api";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    const selectedStopIndex = useSelector((state: RootState) => state.stopState.selectedIndex);
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
                // Delete from backend
                await stopsApi.delete(stop.id.value);
                console.log('Stop deleted from backend successfully');
                
                // Remove from local state
                dispatch(StopActions.removeStop(stop.id.value))
                dispatch(StopActions.selectStop(null));
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
                <div className="flex items-center gap-2 justify-between pb-2 border-b">
                    <EditDeleteButton
                        onEdit={handleEditStop}
                        onDelete={handleDeleteStop}
                        disabled={selectedStopIndex === null}
                    />
                    <ButtonAction label="new stop" onClick={handleNewStop} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-2">
                        <h3 className="font-semibold mb-2">stop list ({stops.length})</h3>
                    </div>
                    {stops.length === 0 ? (
                        <p className="text-gray-500 text-sm px-4">No stops created yet. Click "New Stop" to add one.</p>
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