import { useState, type ReactNode } from 'react';

interface OptionalFieldsPanelProps {
    label?: string;
    children: ReactNode;
}

export default function OptionalFieldsPanel({ label = 'optional fields', children }: OptionalFieldsPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-2 px-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
                <span>{label}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 p-4 space-y-4 border border-gray-200 rounded shadow-xl bg-white z-50">
                    {children}
                </div>
            )}
        </div>
    );
}
