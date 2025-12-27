import ButtonAction from '../atoms/ButtonAction';

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
    <div className="border-t p-4 flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        cancel
      </button>
      <ButtonAction
        label="save"
        onClick={onSave}
        disabled={disabled}
      />
    </div>
  );
}
