export type TextInputProps = {
    label: string;
    value: string;
    onChange?: (newValue: string) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    labelClassName?: string
}

export default function TextInput({ label, value, onChange, placeholder = "", error = false, disabled = false, labelClassName = ""}: TextInputProps) {
    return (
        <div className="flex flex-col">
            <label className={`mb-2 font-medium text-gray-700 ${labelClassName}`}>
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full border border-gray-300 rounded px-3 py-2 text-sm ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
        </div>
    );
}