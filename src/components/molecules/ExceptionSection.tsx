import type { ADate, ExceptionDate } from "../../types";
import SelectInput from "../atoms/SelectInput";
import SelectDate from "../atoms/SelectDate";

function stringToADate(str: string | null): ADate | null {
    if (!str) return null;
    const [year, month, day] = str.split('-').map(Number);
    if (!year || isNaN(month) || !day) return null;
    return { date: day, month: month - 1, year };
}

function aDateToString(d: ADate | null): string {
    if (!d) return '';
    const mm = String(d.month + 1).padStart(2, '0');
    const dd = String(d.date).padStart(2, '0');
    return `${d.year}-${mm}-${dd}`;
}

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
        <div className="border-t pt-3">
            <h4 className="text-lg font-semibold mb-2">exception</h4>
            <button
                type="button"
                onClick={onAddException}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors mb-4"
            >
                add exception date
            </button>

            {exceptions.length === 0 && (
                <p className="text-xs text-gray-400 italic py-2">no exception dates</p>
            )}

            <div className="space-y-2">
                {exceptions.map((exception) => (
                    <div key={exception.id.value} className="flex flex-col gap-1.5 p-2 bg-gray-50 rounded-md border border-gray-100 group relative">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <SelectDate
                                    label=""
                                    value={stringToADate(typeof exception.date.value === 'string' ? exception.date.value : null)}
                                    onChange={(aDate) => onDateChange(exception.id.value, aDateToString(aDate))}
                                    placeholder="select date"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemoveException(exception.id.value)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                                title="Remove exception"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <SelectInput
                            label=""
                            value={exception.type.value}
                            onChange={(val) => onTypeChange(exception.id.value, String(val))}
                            options={[
                                { value: "1", label: "Service Added" },
                                { value: "2", label: "Service Removed" },
                            ]}
                            placeholder="exception type"
                            labelClassName="hidden"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
