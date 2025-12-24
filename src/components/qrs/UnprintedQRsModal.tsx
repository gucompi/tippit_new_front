'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UnprintedQRsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unprintedMesas: number[];
  onSendAll?: () => void;
  checkingUnprinted: boolean;
}

export function UnprintedQRsModal({
  isOpen,
  onClose,
  unprintedMesas,
  onSendAll,
  checkingUnprinted,
}: UnprintedQRsModalProps) {
  const t = useTranslations('qrs');

  if (!isOpen) return null;

  const zeroPad = (value: number) => String(value).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[560px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-bold text-gray-800">
            {t('unprintedQRs', { defaultValue: "QR's not printed" })}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          {t('unprintedQRsDescription', {
            defaultValue: 'The following QRs are not printed and do not have a print request.',
          })}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {unprintedMesas.map((m) => (
            <span
              key={m}
              className="px-3 py-1 rounded-full border text-sm"
              style={{ borderColor: '#FF4B9F', backgroundColor: '#FF4B9F1A', color: '#930045' }}
            >
              #{zeroPad(m)}
            </span>
          ))}
          {unprintedMesas.length === 0 && (
            <span className="text-gray-400 text-sm">{t('noPendingQRs', { defaultValue: 'No pending QRs' })}</span>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          {onSendAll && (
            <button
              type="button"
              onClick={onSendAll}
              disabled
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300"
            >
              {t('sendAll', { defaultValue: 'Send all (Coming soon)' })}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-pink-500 border-pink-500 rounded-lg border hover:bg-gray-50"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
        </div>
      </div>
    </div>
  );
}

