'use client';

import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';

interface RankingItem {
  name: string;
  cuit: string;
  total: number;
  position?: number;
}

interface RankingListProps {
  data: RankingItem[];
  title?: string;
}

export function RankingList({ data, title }: RankingListProps) {
  const t = useTranslations('socios');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px] text-gray-400">
          {t('noDataAvailable', { defaultValue: 'No data available' })}
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="space-y-3">
        {sortedData.slice(0, 5).map((item, index) => (
          <div
            key={item.cuit}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold">
              {index === 0 ? <Trophy size={20} className="text-yellow-500" /> : index + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">{item.cuit}</div>
            </div>
            <div className="text-lg font-bold text-pink-500">${item.total.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

