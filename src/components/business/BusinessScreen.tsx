'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { PageHeader, PageHeaderSkeleton } from './PageHeader';
import { StatCard, StatCardSkeleton } from './StatCard';
import { Ranking, RankingSkeleton } from './Ranking';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';

type RangeOption = 'last30Days' | 'last3Months' | 'last6Months' | 'lastYear';

export function BusinessScreen() {
  const t = useTranslations('business');
  const [selectedRange, setSelectedRange] = useState<RangeOption>('lastYear');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const rangeLabels: Record<RangeOption, string> = {
    last30Days: t('filters.last30Days'),
    last3Months: t('filters.last3Months'),
    last6Months: t('filters.last6Months'),
    lastYear: t('filters.lastYear'),
  };

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get stats with TanStack Query via tRPC
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = trpc.business.getStats.useQuery(
    { range: selectedRange },
    {
      staleTime: 60 * 1000, // 1 minute
      enabled: !isPageLoading,
    }
  );

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(e.target.value as RangeOption);
  };

  const handleRefresh = () => {
    refetchStats();
  };

  if (isPageLoading) {
    return <BusinessScreenSkeleton />;
  }

  const isLoading = isLoadingStats || isFetchingStats;

  return (
    <div className="flex-1 w-full animate-fade-in">
      <PageHeader
        titleKey="business.pageHeader.title"
        tooltipKey="business.pageHeader.tooltip"
        onRefresh={handleRefresh}
        isRefreshing={isFetchingStats}
      />

      <div className="w-11/12 max-w-[900px] pt-8 lg:mt-10 px-4 md:px-8 pb-10 min-h-96 mx-auto bg-white overflow-hidden shadow-lg shadow-gray-250 rounded-lg relative mb-10">
        {/* Range Selector */}
        <div className="flex justify-between items-center mb-2">
          <select
            className="px-3 py-2 rounded-md w-full lg:w-auto border border-[#E1E1E1] focus:border-pink-500 focus:outline-none transition-colors cursor-pointer"
            value={selectedRange}
            onChange={handleRangeChange}
          >
            {Object.entries(rangeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <hr className="my-5 -mx-4 md:-mx-8 border-[#EAEAEA]" />

        {/* Stats Grid - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Tips */}
          <StatCard title={t('stats.totalTips')} id="totalTips" isLoading={isLoading}>
            <div className="text-4xl lg:text-5xl font-semibold text-gray-600 hover:text-black pt-2 transition-colors">
              ${stats?.totalTips || '0.00'}
            </div>
          </StatCard>

          {/* QR Codes */}
          <StatCard title={t('stats.qrCodes')} id="qrCodes" isLoading={isLoading}>
            <div className="text-3xl lg:text-4xl text-gray-600 hover:text-black transition-colors">
              <span className="font-semibold">{stats?.activeQRs || 0}</span>
              <span className="text-gray-300">/{stats?.totalQRs || 0}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{t('stats.activeQRs')}</p>
          </StatCard>

          {/* Tips Count */}
          <StatCard title={t('stats.tips')} id="tipsCount" isLoading={isLoading}>
            <div className="text-3xl lg:text-4xl text-gray-600 hover:text-black transition-colors">
              {stats?.tipCount || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">{t('stats.receivedTips')}</p>
          </StatCard>

          {/* Service Rating */}
          <StatCard title={t('stats.service')} id="serviceRating" isLoading={isLoading}>
            <div className="flex flex-col items-center justify-center text-center w-full">
              <div className="text-3xl lg:text-4xl text-gray-600 hover:text-black flex items-center justify-center transition-colors">
                <Star
                  className="fill-current mr-2"
                  style={{ color: tokens.colors.primary }}
                  width={25}
                  height={25}
                />
                <span>{stats?.averageRating || '0.00'}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{t('stats.averageRating')}</p>
            </div>
          </StatCard>
        </div>

        {/* Stats Grid - Second Row (Rankings) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Best Performance */}
          <StatCard title={t('rankings.bestPerformance')} id="bestPerformance" isLoading={isLoading}>
            <Ranking type="performance" range={selectedRange} />
          </StatCard>

          {/* Best Tips */}
          <StatCard title={t('rankings.bestTips')} id="bestTips" isLoading={isLoading}>
            <Ranking type="tips" range={selectedRange} />
          </StatCard>
        </div>
      </div>
    </div>
  );
}

function BusinessScreenSkeleton() {
  return (
    <div className="flex-1 w-full">
      <PageHeaderSkeleton />

      <div className="w-11/12 max-w-[900px] pt-8 lg:mt-10 px-4 md:px-8 pb-10 min-h-96 mx-auto bg-white overflow-hidden shadow-lg shadow-gray-250 rounded-lg relative mb-10">
        {/* Range Selector Skeleton */}
        <div className="flex justify-between items-center mb-2">
          <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <hr className="my-5 -mx-4 md:-mx-8 border-[#EAEAEA]" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Rankings Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-[#EAEAEA] rounded-lg bg-white py-8 px-6 lg:px-10">
            <div className="h-8 w-40 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
            <RankingSkeleton />
          </div>
          <div className="border border-[#EAEAEA] rounded-lg bg-white py-8 px-6 lg:px-10">
            <div className="h-8 w-40 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
            <RankingSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export { BusinessScreenSkeleton };
