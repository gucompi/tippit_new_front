'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FiltersAndTabsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  order: string;
  setOrder: (order: string) => void;
  orderOptions: string[];
  sortDirection: 'asc' | 'desc';
  filteredItems: unknown[];
  totalItems: number;
  extraActions?: React.ReactNode;
}

export function FiltersAndTabs({
  searchTerm,
  setSearchTerm,
  order,
  setOrder,
  orderOptions,
  sortDirection,
  filteredItems,
  totalItems,
  extraActions,
}: FiltersAndTabsProps) {
  const t = useTranslations('qrs');

  const getOrderDisplayTitle = () => {
    if (!order) return t('sortBy', { defaultValue: 'Sort by' });
    const arrow = sortDirection === 'asc' ? ' ↑' : ' ↓';
    return order + arrow;
  };

  const getItemCount = () => {
    if (searchTerm && searchTerm.length >= 3) {
      return filteredItems.length;
    }
    return totalItems || filteredItems.length;
  };

  return (
    <div className="max-w-full bg-white rounded-2xl p-2 xs:p-3 sm:p-4 flex flex-col gap-2 xs:gap-3 sm:gap-2 mx-4 my-6 border-[#E1E1E1] border">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 xs:gap-3 sm:hidden">
        <div className="flex items-center gap-1 xs:gap-2">
          <span className="text-pink-500 text-lg xs:text-xl font-bold">{getItemCount()}</span>
          <span className="text-sm xs:text-base font-semibold">{t('title', { defaultValue: 'My QRs' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center flex-1">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search', { defaultValue: 'Search' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 h-[40px] w-full"
            />
          </div>
          {extraActions && <div>{extraActions}</div>}
        </div>
        <div className="min-w-full">
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 h-[40px]"
          >
            <option value="">{getOrderDisplayTitle()}</option>
            {orderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 text-xl font-bold">{getItemCount()}</span>
          <span className="text-base font-semibold">{t('title', { defaultValue: 'My QRs' })}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search', { defaultValue: 'Search' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 h-[40px] w-[240px]"
            />
          </div>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="min-w-[180px] border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 h-[40px]"
          >
            <option value="">{getOrderDisplayTitle()}</option>
            {orderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {extraActions && <div className="ml-2">{extraActions}</div>}
        </div>
      </div>
    </div>
  );
}

