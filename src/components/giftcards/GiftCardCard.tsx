'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, MoreVertical, Download, Send } from 'lucide-react';
import { tokens } from '@/styles/tokens';

interface GiftCardCardProps {
  card: {
    id: string;
    code_used: string;
    benefit: number;
    expiration_date: string;
    description?: string;
    used: boolean;
    email?: string;
    phone_number?: string;
    name?: string;
  };
  cardNumber: number;
  formatDate: (date: string) => string;
  onResend?: () => void;
  onDownload?: () => void;
}

export function GiftCardCard({
  card,
  cardNumber,
  formatDate,
  onResend,
  onDownload,
}: GiftCardCardProps) {
  const t = useTranslations('giftCards');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date();
  const expirationDate = new Date(card.expiration_date);
  const isExpired = expirationDate < today;
  const isUsed = card.used === true;

  let cardStatus: { status: string; color: string; text: string };
  if (isUsed) {
    cardStatus = { status: 'used', color: 'orange', text: t('used') };
  } else if (isExpired) {
    cardStatus = { status: 'expired', color: 'red', text: t('expired') };
  } else {
    cardStatus = { status: 'active', color: 'green', text: t('active') };
  }

  const handleCopy = (text: string, type: 'code' | 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCodeId(card.code_used);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  const formattedCardNumber = String(cardNumber || 0).padStart(3, '0');
  const formattedBenefit = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(card.benefit);

  return (
    <div className="bg-white rounded-2xl border border-[#E1E1E1] px-5 py-5 h-[400px] w-[260px] hover:shadow-lg transition-all duration-200 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1 rounded-full border flex items-center justify-center"
            style={{
              borderColor: tokens.colors.primary,
              backgroundColor: `${tokens.colors.primary}1A`,
              color: '#930045',
            }}
          >
            <span className="font-normal text-xs">#{formattedCardNumber}</span>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
              cardStatus.color === 'red'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : cardStatus.color === 'orange'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-green-100 text-green-700 border border-green-200'
            }`}
          >
            {cardStatus.text}
          </span>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm z-50">
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setMenuOpen(false);
                  onResend?.();
                }}
              >
                <Send size={14} /> {t('resend')}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setMenuOpen(false);
                  onDownload?.();
                }}
              >
                <Download size={14} /> {t('download')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gift Card Amount */}
      <div
        className="flex items-center justify-center flex-col rounded-2xl mb-2 mt-2 h-[74px] px-2"
        style={{ backgroundColor: `${tokens.colors.primary}0D` }}
      >
        <p className="font-bold text-sm" style={{ color: tokens.colors.primary }}>
          GIFT CARD
        </p>
        <p
          className="font-bold text-2xl truncate w-full text-center"
          style={{ color: tokens.colors.primary }}
          title={formattedBenefit}
        >
          {formattedBenefit}
        </p>
      </div>

      {/* Customer Name */}
      <div className="mb-3 mt-2">
        <h3 className="w-full font-semibold text-base text-center truncate" title={card.name}>
          {card.name || 'Customer'}
        </h3>
      </div>

      {/* Information Sections */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {/* Code */}
        <div className="bg-[#FAFAFA] rounded py-2 px-3 h-[44px] border border-[#E1E1E1]">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-medium text-[#878787] uppercase tracking-wide block">
                {t('codeLabelCard')}
              </label>
              <p className="text-xs truncate" style={{ color: tokens.colors.primary }}>
                {card.code_used}
              </p>
            </div>
            <button
              onClick={() => handleCopy(card.code_used, 'code')}
              className="text-black hover:text-pink-600 transition-colors ml-1 flex-shrink-0 p-0.5"
              title={t('copyCode')}
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Phone */}
        {card.phone_number && (
          <div className="bg-[#FAFAFA] rounded py-2 px-3 h-[44px] border border-[#E1E1E1]">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-medium text-[#878787] uppercase tracking-wide block">
                  {t('phoneLabel')}
                </label>
                <p className="text-xs truncate" style={{ color: tokens.colors.primary }}>
                  {card.phone_number}
                </p>
              </div>
              <button
                onClick={() => handleCopy(card.phone_number!, 'phone')}
                className="text-black hover:text-pink-500 transition-colors ml-1 flex-shrink-0 p-0.5"
                title={t('copyPhone')}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Email */}
        {card.email && (
          <div className="bg-[#FAFAFA] rounded py-2 px-3 h-[44px] border border-[#E1E1E1]">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-medium text-[#878787] uppercase tracking-wide block">
                  {t('emailLabel')}
                </label>
                <p className="text-xs truncate" style={{ color: tokens.colors.primary }}>
                  {card.email}
                </p>
              </div>
              <button
                onClick={() => handleCopy(card.email!, 'email')}
                className="text-black hover:text-pink-500 transition-colors ml-1 flex-shrink-0 p-0.5"
                title={t('copyEmail')}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Description */}
        {card.description && (
          <div className="bg-blue-50 rounded p-2">
            <label className="text-xs font-medium text-[#878787] uppercase tracking-wide block">
              {t('descriptionLabel')}
            </label>
            <p className="text-xs text-blue-900 line-clamp-1">{card.description}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#878787]">
            <span>
              {t('expiresOnPrefix')} {formatDate(card.expiration_date)}
            </span>
          </div>
        </div>
      </div>

      {/* Copy Success Indicator */}
      {copiedCodeId === card.code_used && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
          {t('copied')}
        </div>
      )}
    </div>
  );
}

