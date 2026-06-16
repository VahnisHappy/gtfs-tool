import { useState, useRef, useEffect, useMemo } from "react";

export type SelectInputProps = {
    label: string;
    value?: string | number;
    onChange?: (value: string | number) => void;
    options?: { value: string | number; label: string }[];
    placeholder?: string;
    labelClassName?: string;
    error?: boolean;
    searchable?: boolean;
}

export default function SelectInput({ label, value, onChange, options = [], placeholder = "select", labelClassName = "", error = false, searchable = false }: SelectInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get the label for the selected value
    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayText = selectedOption ? selectedOption.label : placeholder;

    // Filter options by search term
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        const lower = search.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(lower) ||
            String(opt.value).toLowerCase().includes(lower)
        );
    }, [options, search]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable) {
            // Small delay to ensure the input is rendered
            requestAnimationFrame(() => searchInputRef.current?.focus());
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue: string | number) => {
        if (String(value) === String(optionValue)) { onChange?.(optionValue === '' ? '' : optionValue)}
        else {onChange?.(optionValue)}
        setIsOpen(false);
        setSearch("");
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (isOpen) setSearch("");
    };

    return (
        <div className="flex flex-col">
            <label> {label} </label>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`w-full px-3 py-2 border rounded-md bg-white text-left focus:outline-none flex items-center justify-between ${error ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <span className={`block truncate mr-2 ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}
                        title={displayText}>
                        {displayText}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {/* Search input */}
                        {searchable && (
                            <div className="p-2 border-b border-gray-200">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="search…"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[1A6EBF]"
                                />
                            </div>
                        )}

                        <div className="max-h-52 overflow-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-2 text-gray-500 text-sm">
                                    {search ? 'no results found' : 'no options available'}
                                </div>
                            ) : (
                                <ul className="py-1">
                                    {filteredOptions.map((option) => (
                                        <li
                                            key={String(option.value)}
                                            onClick={() => handleSelect(option.value)}
                                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm ${
                                                String(value) === String(option.value) ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                            }`}
                                        >
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}