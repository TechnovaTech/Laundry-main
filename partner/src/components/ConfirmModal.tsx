interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-black">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border-2 border-gray-300 font-semibold text-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg font-semibold text-white"
            style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
