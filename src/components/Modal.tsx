import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  widthClass?: string; // Prop to control the width, e.g., 'max-w-lg', 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, widthClass = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* The main modal container now uses the widthClass prop */}
      <div
        className={`bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full ${widthClass} relative flex flex-col max-h-[90vh] animate-slide-in-up`}
        onClick={e => e.stopPropagation()}
      >
        {/* Green accent line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl"></div>

        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-semibold text-black dark:text-white pt-1">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;