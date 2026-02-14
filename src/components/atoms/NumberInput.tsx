export type NumberInputProps = {
    label: string;
    value: number | string;
    onChange?: (newValue: number) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    labelClassName?: string;
    step?: number;
    min?: number;
    max?: number;
    precision?: number;
}

export default function NumberInput({ 
    label, 
    value, 
    onChange, 
    placeholder = "", 
    error = false, 
    disabled = false, 
    labelClassName = "",
    step = 0.000001,
    min,
    max,
    precision = 6
}: NumberInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (onChange) {
            // Allow empty string to clear, otherwise parse as float
            const numValue = val === '' ? 0 : parseFloat(parseFloat(val).toFixed(precision));
            if (!isNaN(numValue)) {
                onChange(numValue);
            }
        }
    };

    // Format the displayed value to the specified precision
    const displayValue = typeof value === 'number' && value !== 0 
        ? value.toFixed(precision) 
        : value;

    return (
        <div className="flex flex-col">
            <label className={`mb-2 font-medium text-gray-700 ${labelClassName}`}>
                {label}
            </label>
            <input
                type="number"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                step={step}
                min={min}
                max={max}
                className={`w-full border border-gray-300 rounded px-3 py-2 text-sm ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
        </div>
    );
}
