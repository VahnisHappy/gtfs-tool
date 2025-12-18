export type ButtonActionProps = {
    label?: string,
    onClick?: () => void,
    disabled?: boolean,
}

export default function ButtonAction({ label, onClick, disabled }: ButtonActionProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                disabled 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#00A8E8] hover:bg-[#009AD6] active:bg-[#009AD6] focus:ring-[#009AD6]'
            }`}
            aria-label={label}
        >
            {label}
        </button>
        
    )
}