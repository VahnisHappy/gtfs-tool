import type { ExceptionDate } from "../../types";

interface ExceptionSectionProps {
    exceptions: ExceptionDate[];
    onAddException: () => void;
    onRemoveException: (id: string) => void;
    onDateChange: (id: string, date: string) => void;
    onTypeChange: (id: string, type: string) => void;
}

export default function ExceptionSection({
    exceptions,
    onAddException,
    onRemoveException,
    onDateChange,
    onTypeChange
}: ExceptionSectionProps) {
    return (
        <div className="border-t pt-4">
            <h4 className="text-lg font-semibold mb-4">exception</h4>
            
            <button
                type="button"
                onClick={onAddException}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors mb-4"
            >
                add exception date
            </button>

            <div className="space-y-3">
                {exceptions.map((exception) => (
                    <div key={exception.id.value} className="flex items-center gap-2">
                        <input
                            type="date"
                            value={typeof exception.date.value === 'string' ? exception.date.value : ''}
                            onChange={(e) => onDateChange(exception.id.value, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={exception.type.value}
                            onChange={(e) => onTypeChange(exception.id.value, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">exception type</option>
                            <option value="1">Service Added</option>
                            <option value="2">Service Removed</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => onRemoveException(exception.id.value)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
