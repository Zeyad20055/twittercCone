// ============================================================
// CONFIRM DIALOG COMPONENT
// ============================================================

import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-twitter-text mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="btn-outline" disabled={isLoading}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-danger"
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
