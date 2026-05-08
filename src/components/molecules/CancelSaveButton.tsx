interface CancelSaveButtonProps {
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export default function CancelSaveButton({
  onCancel,
  onSave,
  disabled = false
}: CancelSaveButtonProps) {
  return (
    <div className="flex justify-end gap-3 p-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
      >
        cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="px-6 py-2 text-sm text-white bg-[#00A8E8] hover:bg-[#009AD6] rounded-md border border-[#009AD6] transition-colors"
        disabled={disabled}
      >
        save
      </button>
    </div>
  );
}
