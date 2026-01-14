import { useState, useRef, useEffect } from "react";

export type SelectInputProps = {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export default function SelectInput({ label, value, onChange, options = [], placeholder = "select" }: SelectInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get the label for the selected value
    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        if (value === optionValue) { onChange?.("")}
        else {onChange?.(optionValue)}
        setIsOpen(false)
    };

    return (
        <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                >
                    <span className={`block truncate mr-2 ${value ? 'text-gray-900' : 'text-gray-500'}`}
                        title={displayText}>
                        {displayText}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-3 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {options.length === 0 ? (
                            <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
                        ) : (
                            <ul className="py-1">
                                {options.map((option) => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                                            value === option.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                        }`}
                                    >
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}