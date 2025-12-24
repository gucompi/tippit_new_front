'use client';

import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ViewQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  mesa: number | null;
  qrImageUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
  qrUrl?: string;
}

export function ViewQRModal({
  isOpen,
  onClose,
  mesa,
  qrImageUrl,
  isLoading,
  onDownload,
  qrUrl,
}: ViewQRModalProps) {
  const t = useTranslations('qrs');

  if (!isOpen || !mesa) return null;

  const zeroPad = (value: number) => String(value).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 border border-pink-300 rounded-full px-4 py-2">
            <span className="text-pink-600 font-semibold text-sm"># {zeroPad(mesa)}</span>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 w-64">
              <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
            </div>
          ) : qrImageUrl ? (
            <Image
              src={qrImageUrl}
              alt={`QR Code for table ${mesa}`}
              width={256}
              height={256}
              className="w-64 h-64 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-64 w-64 text-gray-500">
              {t('errorLoadingQR', { defaultValue: 'Error loading QR' })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition flex items-center justify-center gap-2"
              onClick={onDownload}
              disabled={isLoading}
            >
              <Download size={16} />
              {t('download', { defaultValue: 'Download' })}
            </button>

            {qrUrl && (
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition flex items-center justify-center gap-2 text-center"
              >
                <ExternalLink size={16} />
                {t('visitQR', { defaultValue: 'Visit QR' })}
              </a>
            )}
          </div>

          <button
            type="button"
            className="w-full bg-white text-pink-500 px-6 py-3 rounded-full font-semibold hover:bg-pink-50 transition border-2 border-pink-500"
            onClick={onClose}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
        </div>
      </div>
    </div>
  );
}

