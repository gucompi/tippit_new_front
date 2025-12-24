'use client';

import { useTranslations } from 'next-intl';

interface TabsPillProps {
  activeTab: 'tips' | 'reviews';
  onTabChange: (tab: 'tips' | 'reviews') => void;
}

export function TabsPill({ activeTab, onTabChange }: TabsPillProps) {
  const t = useTranslations('socios');

  return (
    <div className="tabs-pill-container flex justify-center mb-6">
      <div className="flex bg-[#FF4B9F1A] rounded-full p-1">
        <button
          type="button"
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeTab === 'tips'
              ? 'bg-[#EB5998] text-white'
              : 'text-gray-700 hover:text-pink-500'
          }`}
          onClick={() => onTabChange('tips')}
        >
          {t('tabs.tips', { defaultValue: 'Tips' })}
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-[#EB5998] text-white'
              : 'text-gray-700 hover:text-pink-500'
          }`}
          onClick={() => onTabChange('reviews')}
        >
          {t('tabs.reviews', { defaultValue: 'Reviews' })}
        </button>
      </div>
    </div>
  );
}

