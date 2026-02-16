import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { RouteActions } from '../../store/actions';

interface RouteStopsSectionProps {
    stopIndexes: number[];
}

export default function RouteStopsSection({ stopIndexes }: RouteStopsSectionProps) {
    const dispatch = useDispatch();
    const stops = useSelector((state: RootState) => state.stopState.data);

    const uniqueStops = Array.from(new Set(stopIndexes));

    const handleRemoveStop = (stopIndex: number) => {
        dispatch(RouteActions.removeStopFromRoute(stopIndex));
    };

    return (
        <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
                stops ({uniqueStops.length})
            </label>
            
            {uniqueStops.length > 0 ? (
                <div className="space-y-1 border border-gray-200 rounded-md overflow-hidden">
                    {uniqueStops.map((stopIdx, idx) => {
                        const stop = stops[stopIdx];
                        return (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border-b last:border-b-0 group">
                                <span className="text-sm font-semibold text-gray-600 min-w-[60px]">
                                    {stop?.id.value || stopIdx}
                                </span>
                                <span className="text-sm flex-1">
                                    {stop?.name.value || `Stop ${stopIdx}`}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveStop(stopIdx)}
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
