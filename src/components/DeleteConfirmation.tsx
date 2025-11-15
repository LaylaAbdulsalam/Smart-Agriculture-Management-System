import React from 'react';
import Modal from './Modal';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  t: (key: string) => string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onClose, onConfirm, itemName, t }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemName}`}>
      <p className="text-text-light-secondary dark:text-dark-secondary mb-6">
        Are you sure you want to delete this {itemName}? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
