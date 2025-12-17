import React from 'react';
import { TFunction } from '../types';
import Modal from './Modal';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  t?: TFunction; // Keep t optional for broader use
  error?: string;
  title?: string;
  confirmText?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  error,
  title,
  confirmText 
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Deletion'}>
      <div className="space-y-4">
        <p className="text-text-light-secondary dark:text-dark-secondary">
          Are you sure you want to delete {itemName}? This action cannot be undone.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            {confirmText || 'Yes, Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;