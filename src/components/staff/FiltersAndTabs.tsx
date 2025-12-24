'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FiltersAndTabsProps {
  tab: 'personal' | 'roles';
  setTab: (tab: 'personal' | 'roles') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  order: string;
  setOrder: (order: string) => void;
  orderOptions: string[];
  sortDirection: 'asc' | 'desc';
  filteredItems: unknown[];
  totalItems: number;
  totalRolesPercentage?: number;
  loading?: boolean;
  isSearching?: boolean;
}

export function FiltersAndTabs({
  tab,
  setTab,
  searchTerm,
  setSearchTerm,
  order,
  setOrder,
  orderOptions,
  sortDirection,
  filteredItems,
  totalItems,
  totalRolesPercentage = 0,
  loading = false,
  isSearching = false,
}: FiltersAndTabsProps) {
  const t = useTranslations('staff');

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

  const getItemLabel = () => {
    return tab === 'personal' ? t('workers', { defaultValue: 'Workers' }) : t('roles', { defaultValue: 'Roles' });
  };

  return (
    <div className="max-w-full bg-white rounded-2xl p-2 xs:p-3 sm:p-4 flex flex-col gap-2 xs:gap-3 sm:gap-2 mx-4 my-6 border-[#E1E1E1] border">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-2 xs:gap-3 sm:hidden">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center gap-1 xs:gap-2">
            <span className="text-pink-500 text-lg xs:text-xl font-bold">{getItemCount()}</span>
            <span className="text-sm xs:text-base font-semibold">{getItemLabel()}</span>
            {loading && (
              <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-pink-500"></div>
            )}
            {isSearching && (
              <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
          <div className="flex bg-[#FF4B9F1A] rounded-full">
            <button
              type="button"
              className={`px-2 xs:px-3 py-1 font-semibold rounded-l-full w-[70px] xs:w-[80px] h-[28px] xs:h-[32px] transition-colors text-xs ${
                tab === 'roles' ? 'bg-pink-500 text-white' : 'text-black'
              }`}
              onClick={() => setTab('roles')}
            >
              {t('roles', { defaultValue: 'Roles' })}
            </button>
            <button
              type="button"
              className={`px-2 xs:px-3 py-1 font-semibold rounded-r-full w-[70px] xs:w-[80px] h-[28px] xs:h-[32px] transition-colors text-xs ${
                tab === 'personal' ? 'bg-pink-500 text-white' : 'text-black'
              }`}
              onClick={() => setTab('personal')}
            >
              {t('workers', { defaultValue: 'Workers' })}
            </button>
          </div>
        </div>

        {tab === 'roles' && (
          <div className="flex items-center justify-center gap-1 xs:gap-2 bg-gray-50 px-2 xs:px-3 py-1 xs:py-2 rounded-full">
            <span className="text-xs text-gray-600">{t('totalPercentage', { defaultValue: 'Total percentage' })}:</span>
            <span className="text-xs font-semibold text-pink-500">{totalRolesPercentage}%</span>
            <span className="text-xs text-gray-500">{t('available', { defaultValue: 'available' })}</span>
          </div>
        )}

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
          <span className="text-base font-semibold">{getItemLabel()}</span>
          {tab === 'roles' && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full ml-4">
              <span className="text-sm text-gray-600">{t('totalPercentage', { defaultValue: 'Total percentage' })}:</span>
              <span className="text-sm font-semibold text-pink-500">{totalRolesPercentage}%</span>
              <span className="text-sm text-gray-500">{t('available', { defaultValue: 'available' })}</span>
            </div>
          )}
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
          <div className="flex bg-[#FF4B9F1A] rounded-full ml-4">
            <button
              type="button"
              className={`px-4 py-1 rounded-l-full w-[137px] h-[40px] transition-colors text-sm ${
                tab === 'roles' ? 'bg-[#EB5998] text-white' : 'text-black'
              }`}
              onClick={() => setTab('roles')}
            >
              {t('roles', { defaultValue: 'Roles' })}
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded-r-full w-[137px] h-[40px] transition-colors text-sm ${
                tab === 'personal' ? 'bg-[#EB5998] text-white' : 'text-black'
              }`}
              onClick={() => setTab('personal')}
            >
              {t('workers', { defaultValue: 'Workers' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

