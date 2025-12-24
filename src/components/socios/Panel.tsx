'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/lib/trpc';
import { LargeCard } from './LargeCard';
import { SimpleAreaChart } from './SimpleAreaChart';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { RankingList } from './RankingList';
import { TablaHistorial } from './TablaHistorial';
import { FilterBar } from './FilterBar';
import { Skeleton } from '@/components/ui';

interface PanelProps {
  restaurantId: string | null;
  isComparisonMode?: boolean;
  onDataLoaded?: (data: any[]) => void;
  onWaiterSelectionsChange?: (waiters: any[]) => void;
  waitersSelected?: any[];
  activeTab?: 'tips' | 'reviews';
}

export function Panel({
  restaurantId,
  isComparisonMode = false,
  onDataLoaded,
  onWaiterSelectionsChange,
  waitersSelected = [],
  activeTab = 'tips',
}: PanelProps) {
  const t = useTranslations('socios');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCuits, setSelectedCuits] = useState<string[]>([]);

  const { data: statisticsData, isLoading } = trpc.socios.getRestaurantStatistics.useQuery(
    {
      restaurantId: restaurantId || 'restaurant-1',
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      selectedCuits: selectedCuits.length > 0 ? selectedCuits : undefined,
    },
    {
      enabled: !!restaurantId,
      staleTime: 30 * 1000,
    }
  );

  const { data: tipsHistoryData, refetch: refetchTipsHistory } = trpc.socios.getTipsHistory.useQuery(
    {
      restaurantId: restaurantId || 'restaurant-1',
      page: 1,
      per_page: 20,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      selectedCuits: selectedCuits.length > 0 ? selectedCuits : undefined,
    },
    {
      enabled: !!restaurantId && activeTab === 'tips',
      staleTime: 30 * 1000,
    }
  );

  useEffect(() => {
    if (statisticsData && onDataLoaded) {
      onDataLoaded([statisticsData]);
    }
  }, [statisticsData, onDataLoaded]);

  const handleDateChange = useCallback((fromDate: string, toDate: string) => {
    setStartDate(fromDate);
    setEndDate(toDate);
  }, []);

  const handleCuitsChange = useCallback(
    (waiters: any[]) => {
      const cuits = waiters.map((w) => w.cuit || w).filter(Boolean);
      setSelectedCuits(cuits);
      if (onWaiterSelectionsChange) {
        onWaiterSelectionsChange(waiters);
      }
    },
    [onWaiterSelectionsChange]
  );

  const handleGetTips = useCallback(
    (page: number) => {
      refetchTipsHistory();
    },
    [refetchTipsHistory]
  );

  // Mock waiters list for filter
  const waitersList = useMemo(() => {
    if (statisticsData?.top_5_tips_accumulated_waiter) {
      return statisticsData.top_5_tips_accumulated_waiter.map((w) => ({
        name: w.name,
        cuit: w.cuit,
      }));
    }
    return [];
  }, [statisticsData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={200} className="rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!statisticsData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E1E1E1] text-center">
        <p className="text-gray-500">{t('noDataAvailable', { defaultValue: 'No data available' })}</p>
      </div>
    );
  }

  return (
    <div className="panel space-y-6">
      <FilterBar
        onChangeDates={handleDateChange}
        filterOptionsName={waitersList}
        setSelectedCuits={handleCuitsChange}
        activeTab={activeTab}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LargeCard
          title="total_tips_and_cash"
          number={statisticsData.total_tips_and_cash}
          showEyeButton={false}
        />
        <LargeCard title="count_tips" number={statisticsData.count_tips} />
        <LargeCard title="average_tip" number={statisticsData.average_tip} />
        <LargeCard title="active_qrs_count" number={statisticsData.active_qrs_count} />
        <LargeCard title="roles_count" number={statisticsData.roles_count} />
        <LargeCard title="employees_count" number={statisticsData.employees_count} />
      </div>

      {activeTab === 'tips' && (
        <>
          <SimpleAreaChart
            data={statisticsData.tip_historic_daily}
            title={t('cards.tip_historic_daily', { defaultValue: 'Daily Tips History' })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PieChart
              data={Object.entries(statisticsData.payment_methods_count).map(([key, value]) => ({
                key,
                value: value as number,
              }))}
              title={t('cards.payment_methods_count', { defaultValue: 'Payment Methods' })}
            />
            <BarChart
              data={statisticsData.avg_tip_by_days.map((d) => ({
                label: d.day,
                value: d.value,
              }))}
              title={t('cards.avg_tip_by_days', { defaultValue: 'Average Tips by Day' })}
            />
          </div>

          <RankingList
            data={statisticsData.top_5_tips_accumulated_waiter}
            title={t('cards.top_5_tips_accumulated_waiter', { defaultValue: 'Top 5 Employees' })}
          />

          <TablaHistorial
            data={tipsHistoryData?.tips}
            total={tipsHistoryData?.total || 0}
            getTips={handleGetTips}
            isFiltered={!!startDate || !!endDate || selectedCuits.length > 0}
            isComparisonMode={isComparisonMode}
          />
        </>
      )}

      {activeTab === 'reviews' && (
        <>
          <SimpleAreaChart
            data={statisticsData.review_historic_daily.map((d) => ({
              date: d.date,
              value: d.count,
            }))}
            title={t('cards.review_historic_daily', { defaultValue: 'Daily Reviews' })}
          />
          <SimpleAreaChart
            data={statisticsData.rating_historic_daily.map((d) => ({
              date: d.date,
              value: d.rating,
            }))}
            title={t('cards.rating_historic_daily', { defaultValue: 'Daily Ratings' })}
          />
        </>
      )}
    </div>
  );
}

