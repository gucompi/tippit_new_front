'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { NotificationCard } from './NotificationCard';
import { Skeleton } from '@/components/ui';

export function NotificationsScreen() {
  const t = useTranslations('notifications');
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = trpc.notifications.getNotifications.useQuery(
    {
      page,
      per_page: perPage,
      filter,
    },
    {
      staleTime: 30 * 1000, // 30 seconds cache
    }
  );

  const { data: statsData, isLoading: isLoadingStats } = trpc.notifications.getStats.useQuery(
    undefined,
    {
      staleTime: 30 * 1000,
    }
  );

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetchNotifications();
      utils.notifications.getStats.invalidate();
    },
  });

  const notifications = notificationsData?.data || [];
  const pagination = {
    page: notificationsData?.page || 1,
    per_page: notificationsData?.per_page || 10,
    total: notificationsData?.total || 0,
    has_next: notificationsData?.has_next || false,
    has_prev: notificationsData?.has_prev || false,
  };
  const unreadCount = statsData?.unread_notifications || 0;

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleFilterChange = useCallback((newFilter: 'all' | 'unread' | 'read') => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoadingNotifications && page === 1) {
    return (
      <main className="flex-1">
        <PageHeader
          titleKey="notifications.title"
          tooltipKey="notifications.pageHeaderTooltip"
          showNotificationIcon={false}
        />
        <div className="w-[calc(100%-36px)] bg-white rounded-lg border border-gray-200 p-4 mb-6 mx-[18px]">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageHeader
        titleKey="notifications.title"
        tooltipKey="notifications.pageHeaderTooltip"
        showNotificationIcon={false}
      />

      <div className="w-[calc(100%-36px)] bg-white rounded-lg border border-gray-200 p-4 mb-6 mx-[18px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
              className="px-4 py-2 bg-[#EB5998] text-white text-sm rounded-lg hover:bg-[#EB5998] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                  {markAllAsReadMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircle size={16} />
              )}
              <span>{t('markAllRead', { defaultValue: 'Mark all as read' })}</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all' as const, label: t('all', { defaultValue: 'All' }) },
            { key: 'unread' as const, label: t('unread', { defaultValue: 'Unread' }) },
            { key: 'read' as const, label: t('read', { defaultValue: 'Read' }) },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleFilterChange(key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoadingNotifications ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">
              {t('loading', { defaultValue: 'Loading notifications...' })}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filter === 'unread'
                    ? t('noUnread', { defaultValue: 'You have no unread notifications' })
                    : filter === 'read'
                      ? t('noRead', { defaultValue: 'You have no read notifications' })
                      : t('noNotifications', { defaultValue: 'You have no notifications' })}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>
        )}

        {!isLoadingNotifications && notifications.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {t('showing', { defaultValue: 'Showing' })}{' '}
              {(pagination.page - 1) * pagination.per_page + 1} -{' '}
              {Math.min(pagination.page * pagination.per_page, pagination.total)}{' '}
              {t('of', { defaultValue: 'of' })} {pagination.total}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previous', { defaultValue: 'Previous' })}
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next', { defaultValue: 'Next' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

