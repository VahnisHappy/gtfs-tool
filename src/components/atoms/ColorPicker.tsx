import { useState, useRef, useEffect } from "react";
import TextInput from "./TextInput";

export type ColorPickerProps = {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

const PRESET_COLORS = [
    '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE', '#007AFF',
    '#5856D6', '#AF52DE', '#FF2D55', '#A2845E', '#8E8E93', '#1C1C1E',
];

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelectColor = (color: string) => {
        onChange(color);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col relative">
            {label && (
                <label>{label}</label>
            )}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-1.5 border border-gray-300 rounded-md transition-colors bg-white hover:bg-gray-50"
            >
                <div
                    className="w-8 h-7 rounded-sm border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: value }}
                />
                <span className="text-sm font-mono text-gray-600">{value.toLowerCase()}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Popup */}
                    <div
                        ref={popupRef}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 w-72"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">select color</p>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Custom</p>
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    padding: '2px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                }}
                            />
                            <div className="flex-1">
                                <TextInput
                                    label=""
                                    value={value}
                                    onChange={(v) => {
                                        const hex = v.startsWith('#') ? v : '#' + v;
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                                            onChange(hex);
                                        }
                                    }}
                                    placeholder="#000000"
                                    labelClassName="hidden"
                                />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">presets</p>
                        <div className="grid grid-cols-6 gap-2 mb-3">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleSelectColor(color)}
                                    className={`rounded-lg cursor-pointer transition-transform hover:scale-110 ${value === color ? 'ring-2 ring-offset-2 ring-[#333333]' : ''}`}
                                    style={{
                                        backgroundColor: color,
                                        width: '32px',
                                        height: '32px',
                                        padding: 0,
                                        border: 'none',
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}