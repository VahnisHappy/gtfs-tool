import type { Trip } from "../../types";

export type TripCardProps = {
    trip: Trip;
    routeName?: string;
    calendarId?: string;
    isSelected?: boolean;
    onSelect: () => void;
}

export default function TripCard({ trip, routeName, calendarId, isSelected, onSelect }: TripCardProps) {
    const isEmpty = !trip.id.value;
    const stopCount = trip.stopTimes.length;

    return (
        <li
            onClick={onSelect}
            className={`px-2 py-1 cursor-pointer transition-colors border-b border-gray-200 ${
                isSelected
                    ? 'bg-blue-50'
                    : 'bg-white hover:bg-gray-50'
            }`}
        >
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    {isEmpty ? (
                        <span className="text-gray-400 italic">
                            New Trip (unsaved)
                        </span>
                    ) : (
                        <span className="font-semibold text-gray-900">
                            {trip.id.value}
                        </span>
                    )}
                </div>
                {!isEmpty && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                        {routeName && (
                            <div>Route: {routeName}</div>
                        )}
                        {calendarId && (
                            <div>Service: {calendarId}</div>
                        )}
                        <div>{stopCount} stop{stopCount !== 1 ? 's' : ''}</div>
                    </div>
                )}
            </div>
        </li>
    );
}
