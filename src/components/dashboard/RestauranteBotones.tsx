'use client';

import { useTranslations } from 'next-intl';
import { Calendar, Coffee, Users } from 'lucide-react';

interface RestauranteBotonesProps {
  activeButton: 'Tiempo' | 'Mesa' | 'Mozo';
  handleButtonClick: (button: 'Tiempo' | 'Mesa' | 'Mozo') => void;
}

export function RestauranteBotones({ activeButton, handleButtonClick }: RestauranteBotonesProps) {
  const t = useTranslations('dashboard.restaurant.buttons');

  return (
    <div className="flex justify-center gap-4">
      <div
        className={`flex flex-col items-center rounded-lg p-2 transition-all duration-200 ${
          activeButton === 'Tiempo' ? 'bg-[#e9f3fd]' : ''
        }`}
      >
        <button
          type="button"
          aria-label="Ver por tiempo"
          className={`border ${
            activeButton === 'Tiempo' ? 'border-[#198cff]' : 'border-[#cccccc]'
          } rounded-full p-3`}
          onClick={() => handleButtonClick('Tiempo')}
        >
          <Calendar
            size={24}
            className={activeButton === 'Tiempo' ? 'text-[#198cff]' : 'text-gray-700'}
          />
        </button>
        <span className="text-xs mt-2">{t('viewByTime', { defaultValue: 'View by Time' })}</span>
      </div>
      <div
        className={`flex flex-col items-center rounded-lg p-2 transition-all duration-200 ${
          activeButton === 'Mesa' ? 'bg-[#e9f3fd]' : ''
        }`}
      >
        <button
          type="button"
          aria-label="Ver por mesa"
          className={`border ${
            activeButton === 'Mesa' ? 'border-[#198cff]' : 'border-[#cccccc]'
          } rounded-full p-3`}
          onClick={() => handleButtonClick('Mesa')}
        >
          <Coffee
            size={24}
            className={activeButton === 'Mesa' ? 'text-[#198cff]' : 'text-gray-700'}
          />
        </button>
        <span className="text-xs mt-2">{t('viewByTable', { defaultValue: 'View by Table' })}</span>
      </div>
      <div
        className={`flex flex-col items-center rounded-lg p-2 transition-all duration-200 ${
          activeButton === 'Mozo' ? 'bg-[#e9f3fd]' : ''
        }`}
      >
        <button
          type="button"
          aria-label="Ver por mozo"
          className={`border ${
            activeButton === 'Mozo' ? 'border-[#198cff]' : 'border-[#cccccc]'
          } rounded-full p-3`}
          onClick={() => handleButtonClick('Mozo')}
        >
          <Users
            size={24}
            className={activeButton === 'Mozo' ? 'text-[#198cff]' : 'text-gray-700'}
          />
        </button>
        <span className="text-xs mt-2">{t('viewByWaiter', { defaultValue: 'View by Waiter' })}</span>
      </div>
    </div>
  );
}

