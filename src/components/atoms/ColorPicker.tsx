export type ColorPickerProps = {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
    return (
        <div className="flex flex-col">
            {label && (
                <label className="mb-2 font-medium text-gray-700">{label}</label>
            )}
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-sm font-mono text-gray-600">{value.toUpperCase()}</span>
            </div>
        </div>
    )
}