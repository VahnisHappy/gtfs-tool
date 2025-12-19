import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import type { RootState } from "../../store";
import { openStopDetail } from "../../store/slices/appSlice";
import { StopActions } from "../../store/actions";
import ButtonAction from "../atoms/ButtonAction";
import StopContentDetail from "../organisms/StopContentDetail";
import EditDeleteButton from "../molecules/EditDeleteButton";
import StopCard from "../molecules/StopCard";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    const isStopDetailOpen = useSelector((state: RootState) => state.appState.isStopDetailOpen);
    const dispatch = useDispatch();
    const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
    const stopListRef = useRef<HTMLDivElement>(null);

    const handleNewStop = () => {
        setSelectedStopIndex(null);
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
    
    const handleDeleteStop = () => {
        if (selectedStopIndex === null) return;
        
        // Confirm deletion
        const stop = stops[selectedStopIndex];
        if (window.confirm(`Are you sure you want to delete "stop: ${stop.name.value}"?`)) {
            dispatch(StopActions.removeStop(selectedStopIndex));
            setSelectedStopIndex(null);
        }
    }
    
    const handleSelectStop = (index: number) => {
        // Toggle selection: if clicking the same stop, deselect it
        setSelectedStopIndex(prevIndex => prevIndex === index ? null : index);
    }

    
    
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, [isStopDetailOpen]);

    // Handle clicks outside the stop list to deselect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (stopListRef.current && !stopListRef.current.contains(event.target as Node)) {
                setSelectedStopIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    <ButtonAction label="New Stop" onClick={handleNewStop} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-2">
                        <h3 className="font-semibold mb-2">Stop List ({stops.length})</h3>
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