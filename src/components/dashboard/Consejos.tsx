'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb } from 'lucide-react';

export function Consejos() {
  const t = useTranslations('dashboard.mozo.consejos');
  
  const items = useMemo(
    () => [
      t('tip1', { defaultValue: 'Introduce yourself, tell them your name and ask for theirs.' }),
      t('tip2', { defaultValue: 'Maintain a positive and helpful attitude.' }),
      t('tip3', { defaultValue: 'Regularly check if customers need anything.' }),
      t('tip4', { defaultValue: 'Be attentive to details and personalize the service.' }),
      t('tip5', { defaultValue: 'Thank customers for their visit.' }),
      t('tip6', { defaultValue: 'Say goodbye with a smile and a thank you.' }),
    ],
    [t]
  );

  const [currentItem, setCurrentItem] = useState(items[0] || '');
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
  }, [items]);

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
    setButtonClicked(true);

    setTimeout(() => {
      setButtonClicked(false);
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto relative mt-4">
      <div className="flex items-center justify-end">
        <div className="relative">
          <div className="bg-blue-200 p-4 my-6 rounded-lg min-h-[130px] flex items-center justify-center text-gray-800">
            {currentItem}
          </div>
          <div className="absolute bottom-6 transform translate-x-[140px]">
            <div className="w-6 h-6 bg-blue-200 rotate-45 transform origin-bottom-left"></div>
          </div>
        </div>
      </div>

      <div
        className={`relative bottom-0 mt-2 transform ${
          buttonClicked ? 'translate-y-[-10px]' : 'translate-y-0'
        } transition-transform duration-240 ease-in-out`}
      >
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Lightbulb size={18} />
          {t('anotherTip', { defaultValue: 'Another Tip' })}
        </button>
      </div>
    </div>
  );
}

