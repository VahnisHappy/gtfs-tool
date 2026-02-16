import type { Calendar } from "../../types";

export type CalendarCardProps = {
    calendar: Calendar;
    isSelected: boolean;
    onSelect: () => void;
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarCard({ calendar, isSelected, onSelect }: CalendarCardProps) {
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
                {/* <div className=""> */}
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                            {calendar.id.value}
                        </span>
                    </div>
                    <div className="flex gap-1">
                            {calendar.days.map((isActive, idx) => (
                                <div
                                    key={idx}
                                    className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                                        isActive
                                            ? 'bg-blue-500 text-white font-medium'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                    title={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx]}
                                >
                                    {dayLabels[idx]}
                                </div>
                            ))}
                    </div>
                {/* </div> */}
            </div>
        </li>
    );
}
