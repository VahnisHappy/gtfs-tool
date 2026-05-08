export type ButtonActionProps = {
    label?: string,
    onClick?: () => void,
    disabled?: boolean,
    variant?: 'primary' | 'secondary',
}

export default function ButtonAction({ label, onClick, disabled, variant = 'primary' }: ButtonActionProps) {
    const baseClass = 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow transition-colors';
    const variantClass = disabled
        ? 'bg-gray-300 text-white cursor-not-allowed'
        : variant === 'secondary'
            ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            : 'bg-[#00A8E8] text-white hover:bg-[#009AD6] active:bg-[#009AD6] focus:ring-[#009AD6]';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${variantClass}`}
            aria-label={label}
        >
            {label}
        </button>
    )
}