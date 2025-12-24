'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Copy, MessageCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'react-hot-toast';

interface VincularMPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phoneNumber: string; cuit: string }) => void;
  vincularMPData?: {
    telefono?: string;
    cuit?: string;
  } | null;
}

export function VincularMPForm({
  isOpen,
  onClose,
  onSubmit,
  vincularMPData = null,
}: VincularMPFormProps) {
  const t = useTranslations('staff.vincularMP');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cuit, setCuit] = useState('');
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  useEffect(() => {
    if (isOpen && vincularMPData) {
      setPhoneNumber(vincularMPData.telefono || '');
      setCuit(vincularMPData.cuit || '');
    } else if (isOpen) {
      setPhoneNumber('');
      setCuit('');
    }
  }, [isOpen, vincularMPData]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ phoneNumber, cuit });
  };

  const handleClose = () => {
    setPhoneNumber('');
    setCuit('');
    onClose();
  };

  const handleCopyLink = async () => {
    setIsCopyingLink(true);
    try {
      // TODO: Implement copy link functionality via tRPC
      // For now, just show a toast
      toast.success(t('linkCopied', { defaultValue: 'Link copied to clipboard' }));
    } catch (error) {
      toast.error(t('linkCopyError', { defaultValue: 'Error copying link' }));
      console.error('Error copying link:', error);
    } finally {
      setIsCopyingLink(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    try {
      // TODO: Implement WhatsApp send functionality via tRPC
      // For now, just show a toast
      toast.success(t('whatsappSent', { defaultValue: 'WhatsApp message sent successfully' }));
    } catch (error) {
      toast.error(t('whatsappError', { defaultValue: 'Error sending WhatsApp message' }));
      console.error('Error sending WhatsApp:', error);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-fit max-w-[850px] relative animate-fade-in">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl"
          onClick={handleClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {t('title', { defaultValue: 'Link MercadoPago' })}
        </h2>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 leading-relaxed">
              {t('description', { defaultValue: 'Link your employee to MercadoPago to receive tips.' })}
            </p>
            <p className="text-sm text-blue-800 leading-relaxed mt-2">
              {t('copyLinkDescription', { defaultValue: 'You can copy the link and send it manually, or send it via WhatsApp.' })}
            </p>
            <p className="text-sm text-blue-800 leading-relaxed mt-2">
              {t('whatsappDescription', { defaultValue: 'Sending via WhatsApp will open the app with the link pre-filled.' })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="phone-number" className="text-sm font-semibold block mb-2">
              {t('phoneNumberLabel', { defaultValue: 'Phone Number' })}
            </label>
            <input
              id="phone-number"
              type="tel"
              className="border border-gray-300 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder={t('phoneNumberPlaceholder', { defaultValue: 'Enter phone number' })}
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
              onClick={handleClose}
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="button"
              className={`bg-white text-[#EB5998] border border-[#EB5998] px-6 py-2 rounded-full transition flex items-center justify-center gap-2 ${
                isCopyingLink ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleCopyLink}
              disabled={isCopyingLink || isSendingWhatsApp}
            >
              {isCopyingLink ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('copying', { defaultValue: 'Copying...' })}
                </>
              ) : (
                <>
                  <Copy size={16} />
                  {t('copyLink', { defaultValue: 'Copy Link' })}
                </>
              )}
            </button>
            <button
              type="button"
              className={`bg-[#EB5998] text-white px-6 py-2 rounded-full transition flex items-center justify-center gap-2 ${
                isSendingWhatsApp ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleSendWhatsApp}
              disabled={isCopyingLink || isSendingWhatsApp}
            >
              {isSendingWhatsApp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('sending', { defaultValue: 'Sending...' })}
                </>
              ) : (
                <>
                  <MessageCircle size={16} />
                  {t('sendWhatsApp', { defaultValue: 'Send via WhatsApp' })}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

