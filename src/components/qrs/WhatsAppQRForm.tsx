'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WhatsAppQRFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string, mesa: number) => void;
  mesa: number | null;
  onDownloadQR?: (mesa: number) => void;
}

export function WhatsAppQRForm({ isOpen, onClose, onSubmit, mesa, onDownloadQR }: WhatsAppQRFormProps) {
  const t = useTranslations('qrs');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !mesa) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(phoneNumber.trim(), mesa);
      setPhoneNumber('');
      onClose();
    } catch (error) {
      console.error('Error submitting WhatsApp form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {t('sendQRViaWhatsApp', { defaultValue: 'Send QR via WhatsApp' })}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t('phoneNumber', { defaultValue: 'Phone Number' })}
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div className="flex gap-3">
            {onDownloadQR && (
              <button
                type="button"
                onClick={() => onDownloadQR(mesa)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('downloadQR', { defaultValue: 'Download QR' })}
              </button>
            )}
            <button
              type="submit"
              disabled={!phoneNumber.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('sending', { defaultValue: 'Sending...' }) : t('send', { defaultValue: 'Send' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

