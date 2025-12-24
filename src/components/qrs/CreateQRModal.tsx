'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CreateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  isCreating: boolean;
}

export function CreateQRModal({ isOpen, onClose, onCreate, isCreating }: CreateQRModalProps) {
  const t = useTranslations('qrs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[527px] min-h-[256px] w-full mx-4 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[24px] font-bold text-gray-800">{t('newQR', { defaultValue: 'New QR' })}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isCreating}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-left">
            <p className="text-[20px] text-gray-500">
              {t('createQRWarning', {
                defaultValue: 'The QR you are about to create will not be printed. Are you sure you want to create it?',
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCreate}
            disabled={isCreating}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('creating', { defaultValue: 'Creating...' })}
              </>
            ) : (
              t('create', { defaultValue: 'Create' })
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 bg-white text-pink-600 hover:text-white rounded-lg hover:bg-pink-600 border-pink-600 border-2 transition-colors"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
        </div>
      </div>
    </div>
  );
}

