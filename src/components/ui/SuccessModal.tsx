'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  type?: 'success' | 'error';
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  autoClose = true,
  autoCloseDelay = 3000,
  type = 'success',
}: SuccessModalProps) {
  const t = useTranslations('common');
  const [countdown, setCountdown] = useState(Math.ceil(autoCloseDelay / 1000));

  useEffect(() => {
    if (isOpen) {
      setCountdown(Math.ceil(autoCloseDelay / 1000));
    }
  }, [isOpen, autoCloseDelay]);

  useEffect(() => {
    if (isOpen && autoClose && countdown > 0) {
      const countdownTimer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(countdownTimer);
    }
  }, [isOpen, autoClose, countdown]);

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

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

  const displayTitle = title || (type === 'error' ? t('error', { defaultValue: 'Error' }) : t('success', { defaultValue: 'Success' }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 m-4 max-w-md w-full mx-auto animate-scale-in">
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === 'error' ? 'bg-red-100' : 'bg-pink-100'
            }`}
          >
            {type === 'error' ? (
              <X className="w-8 h-8 text-red-500" />
            ) : (
              <Check className="w-8 h-8 text-pink-500" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">{displayTitle}</h3>

        <div className="mb-6 text-center">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {autoClose && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${
                  type === 'error' ? 'bg-red-500' : 'bg-pink-500'
                }`}
                style={{
                  animation: `progress ${autoCloseDelay}ms linear`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t('autoCloseIn', { defaultValue: 'Will close automatically in' })} {countdown}{' '}
              {t('seconds', { defaultValue: 'seconds' })}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            className={`text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 ${
              type === 'error'
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                : 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-300'
            }`}
            onClick={onClose}
          >
            {confirmText || t('accept', { defaultValue: 'Accept' })}
          </button>
        </div>
      </div>
    </div>
  );
}

