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
            <label> {label} </label>
            <input
                type="text"
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                placeholder={placeholder}
                disabled={disabled}
                className={`${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
        </div>
    );
}