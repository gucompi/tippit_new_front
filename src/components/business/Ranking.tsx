'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui';

interface RankingProps {
  type: 'performance' | 'tips';
  range: 'last30Days' | 'last3Months' | 'last6Months' | 'lastYear';
}

export function Ranking({ type, range }: RankingProps) {
  const t = useTranslations('business.rankings');
  
  const { data, isLoading, error } = trpc.business.getRankings.useQuery(
    { type, range },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  if (isLoading) {
    return <RankingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        {t('noData')}
      </div>
    );
  }

  if (!data?.rankings || data.rankings.length === 0) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        {t('noData')}
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="ranking-container">
      {data.rankings.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-2 border border-[#EAEAEA] rounded-md hover:text-black hover:border-pink-200 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <span 
              className="text-2xl font-bold min-w-[24px]"
              style={{ color: tokens.colors.primary }}
            >
              {index + 1}
            </span>
            <span className="text-gray-600 truncate max-w-[120px]">{item.name}</span>
          </div>

          {type === 'performance' ? (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">{item.avgRating.toFixed(2)}</span>
              <Star 
                className="w-5 h-5 fill-current" 
                style={{ color: tokens.colors.primary }}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600 text-lg">
                ${item.totalTips.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function RankingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-2 border border-[#EAEAEA] rounded-md">
          <div className="flex items-center space-x-2">
            <Skeleton variant="text" width={24} height={28} />
            <Skeleton variant="text" width={100} height={20} />
          </div>
          <Skeleton variant="text" width={60} height={20} />
        </div>
      ))}
    </div>
  );
}
