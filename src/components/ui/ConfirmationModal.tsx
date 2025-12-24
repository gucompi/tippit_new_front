'use client';

import { useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  confirmButtonColor?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  icon: Icon = MessageCircle,
  iconColor = 'text-pink-500',
  confirmButtonColor = 'bg-pink-500 hover:bg-pink-600',
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 m-4 max-w-md w-full mx-auto animate-scale-in">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl transition-colors"
          onClick={onClose}
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">{title}</h3>

        <div className="mb-8 text-center">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : confirmButtonColor
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLoading ? 'Sending...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

