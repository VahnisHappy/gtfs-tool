import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { RouteActions } from '../../store/actions';

interface RouteStopsSectionProps {
    stopIndexes: number[];
}

export default function RouteStopsSection({ stopIndexes }: RouteStopsSectionProps) {
    const dispatch = useDispatch();
    const stops = useSelector((state: RootState) => state.stopState.data);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    // Use the actual stopIndexes array (preserving order and allowing duplicates)
    const orderedStops = stopIndexes;

    const handleRemoveStop = (arrayIndex: number) => {
        dispatch(RouteActions.removeStopFromRouteByArrayIndex(arrayIndex));
    };

    const handleDragStart = (idx: number) => {
        setDraggedIdx(idx);
    };

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOverIdx(idx);
    };

    const handleDragLeave = () => {
        setDragOverIdx(null);
    };

    const handleDrop = (toIdx: number) => {
        if (draggedIdx !== null && draggedIdx !== toIdx) {
            dispatch(RouteActions.reorderStopsInRoute({ fromIndex: draggedIdx, toIndex: toIdx }));
        }
        setDraggedIdx(null);
        setDragOverIdx(null);
    };

    const handleDragEnd = () => {
        setDraggedIdx(null);
        setDragOverIdx(null);
    };

    return (
        <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
                stops ({orderedStops.length})
            </label>
            
            {orderedStops.length > 0 ? (
                <div className="space-y-1 border border-gray-200 rounded-md overflow-hidden">
                    {orderedStops.map((stopIdx, idx) => {
                        const stop = stops[stopIdx];
                        const isDragging = draggedIdx === idx;
                        const isDragOver = dragOverIdx === idx;
                        return (
                            <div 
                                key={`${stopIdx}-${idx}`} 
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(idx)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border-b last:border-b-0 group cursor-move transition-all ${
                                    isDragging ? 'opacity-50 bg-gray-100' : ''
                                } ${isDragOver ? 'border-t-2 border-t-blue-500' : ''}`}
                            >
                                <svg className="w-4 h-4 text-gray-400 cursor-grab" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                </svg>
                                <span className="text-xs font-medium text-gray-400 w-5">{idx + 1}</span>
                                <span className="text-sm font-semibold text-gray-600 min-w-[60px]">
                                    {stop?.id.value || stopIdx}
                                </span>
                                <span className="text-sm flex-1">
                                    {stop?.name.value || `Stop ${stopIdx}`}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStop(idx)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                                    title="Remove stop"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    No stops added yet. Click on the map to add stops.
                </p>
            )}
        </div>
    );
}
