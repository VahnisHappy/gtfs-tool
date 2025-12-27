import { useState, useRef, useEffect } from 'react';
import type { ADate } from '../../types';

export type SelectDateProps = {
    label: string;
    value: ADate | null;
    onChange: (date: ADate | null) => void;
    placeholder?: string;
    error?: boolean;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

export default function SelectDate({ label, value, onChange, placeholder = "Select date", error = false }: SelectDateProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Set initial month/year from value if provided
    useEffect(() => {
        if (value) {
            setCurrentMonth(value.month);
            setCurrentYear(value.year);
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDateSelect = (day: number) => {
        onChange({
            date: day,
            month: currentMonth,
            year: currentYear
        });
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(null);
        setIsOpen(false);
    };

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const formatDate = (date: ADate | null) => {
        if (!date) return '';
        return `${months[date.month]} ${date.date}, ${date.year}`;
    };

    const renderCalendar = () => {
        const days = daysInMonth(currentMonth, currentYear);
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const calendarDays = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="h-8 w-8"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= days; day++) {
            const isSelected = value?.date === day && value?.month === currentMonth && value?.year === currentYear;
            const isToday = day === new Date().getDate() && 
                          currentMonth === new Date().getMonth() && 
                          currentYear === new Date().getFullYear();

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`h-8 w-8 rounded text-sm flex items-center justify-center transition-colors ${
                        isSelected
                            ? 'bg-blue-500 text-white font-medium'
                            : isToday
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    {day}
                </button>
            );
        }

        return calendarDays;
    };

    return (
        <div className="flex flex-col relative" ref={dropdownRef}>
            <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full border rounded px-3 py-2 text-sm text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'
                } ${value ? 'text-gray-900' : 'text-gray-400'}`}
            >
                <span>{value ? formatDate(value) : placeholder}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3 w-64">
                    {/* Header with month/year navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="text-sm font-medium text-gray-900">
                            {months[currentMonth]} {currentYear}
                        </div>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {renderCalendar()}
                    </div>

                    {/* Footer with clear button */}
                    {value && (
                        <div className="pt-2 border-t">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="w-full py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
