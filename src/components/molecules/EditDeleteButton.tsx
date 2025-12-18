import ButtonAction from "../atoms/ButtonAction";

export type EditDeleteButtonProps = {
    onEdit: () => void;
    onDelete: () => void;
    disabled: boolean;
}

export default function EditDeleteButton({ onEdit, onDelete, disabled }: EditDeleteButtonProps) {
    return (
        <div className="inline-flex rounded-base shadow-xs -space-x-px" role="group">
            <button
                onClick={onEdit}
                disabled={disabled}
                className={`inline-flex items-center justify-center text-body border border-default bg-neutral-primary-soft hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium leading-5 rounded-l-md text-sm w-9 h-9 focus:outline-none ${
                    disabled
                        ? 'cursor-not-allowed'
                        : 'bg-gray-300 hover:bg-gray-600 active:bg-blue-700 focus:ring-blue-500'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path></svg>
            </button>

            <button
                onClick={onDelete}
                disabled={disabled}
                className={`inline-flex items-center justify-center text-body border border-default bg-neutral-primary-soft hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium leading-5 rounded-r-md text-sm w-9 h-9 focus:outline-none ${
                    disabled
                        ? 'cursor-not-allowed'
                        : 'bg-gray-300 hover:bg-gray-600 active:bg-red-700 focus:ring-red-500'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
            </button>
        </div>
    );
};