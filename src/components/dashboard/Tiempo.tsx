'use client';

import { useTranslations } from 'next-intl';

interface TiempoProps {
  activeSubButton: 'UltimaSemana' | 'UltimaMes' | 'UltimoAnio';
  handleSubButtonClick: (button: 'UltimaSemana' | 'UltimaMes' | 'UltimoAnio') => void;
}

export function Tiempo({ activeSubButton, handleSubButtonClick }: TiempoProps) {
  const t = useTranslations('dashboard.restaurant.time');

  const timeButtons = [
    {
      id: 'UltimaSemana' as const,
      text: t('thisWeek', { defaultValue: 'This Week' }),
    },
    {
      id: 'UltimaMes' as const,
      text: t('lastMonth', { defaultValue: 'Last Month' })},
    {
      id: 'UltimoAnio' as const,
      text: t('thisYear', { defaultValue: 'This Year' })},
  ];

  return (
    <div className="md:flex md:justify-center xl:justify-end mb-5">
      <div className="flex text-xs justify-center md:w-2/3 md:max-w-[400px]">
        {timeButtons.map((button) => (
          <button
            key={button.id}
            type="button"
            className={`py-3 w-full ${
              button.id !== 'UltimoAnio' ? 'mr-2' : ''
            } rounded-md transition-all duration-200 ${
              activeSubButton === button.id
                ? 'text-white bg-[#198cff]'
                : 'bg-gray-200 hover:bg-[#e9f3fd] hover:text-[#198cff]'
            }`}
            onClick={() => handleSubButtonClick(button.id)}
            aria-pressed={activeSubButton === button.id}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}

