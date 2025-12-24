'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { GiftCardCard } from './GiftCardCard';
import { tokens } from '@/styles/tokens';

interface GiftCard {
  id: string;
  code_used: string;
  benefit: number;
  expiration_date: string;
  description?: string;
  used: boolean;
  email?: string;
  phone_number?: string;
  name?: string;
}

interface GiftCardGridProps {
  giftCards: GiftCard[];
  onCreate: () => void;
  formatDate: (date: string) => string;
}

export function GiftCardGrid({ giftCards, onCreate, formatDate }: GiftCardGridProps) {
  const t = useTranslations('giftCards');

  if (giftCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">No gift cards found</p>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-full text-white flex items-center gap-2"
          style={{ backgroundColor: tokens.colors.primary }}
        >
          <Plus size={18} />
          {t('create')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
      {giftCards.map((card, index) => (
        <GiftCardCard
          key={card.id}
          card={card}
          cardNumber={index + 1}
          formatDate={formatDate}
          onResend={() => {
            // TODO: Implement resend
            console.log('Resend gift card:', card.code_used);
          }}
          onDownload={() => {
            // TODO: Implement download
            console.log('Download gift card:', card.code_used);
          }}
        />
      ))}
    </div>
  );
}

