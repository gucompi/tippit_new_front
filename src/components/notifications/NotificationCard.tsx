'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Bell,
  CheckCircle,
  Clock,
  Star,
  Gift,
  BarChart3,
  Users,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
// Using native Date for formatting instead of date-fns

interface Notification {
  id: string;
  type: 'tip' | 'system' | 'staff' | 'giftcard' | 'analytics' | 'alert';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  is_read: boolean;
  timestamp: string;
  createdAt: string;
}

interface NotificationCardProps {
  notification: Notification;
}

const iconMap = {
  tip: Star,
  system: Info,
  staff: Users,
  giftcard: Gift,
  analytics: BarChart3,
  alert: AlertTriangle,
};

const priorityColorMap = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-300',
};

const iconColorMap = {
  tip: 'text-yellow-500',
  system: 'text-blue-500',
  staff: 'text-green-500',
  giftcard: 'text-purple-500',
  analytics: 'text-indigo-500',
  alert: 'text-red-500',
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const t = useTranslations('notifications');
  const utils = trpc.useUtils();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch
      utils.notifications.getNotifications.invalidate();
      utils.notifications.getStats.invalidate();
    },
  });

  const Icon = iconMap[notification.type] || Bell;
  const iconColor = iconColorMap[notification.type] || 'text-gray-500';
  const priorityColor = priorityColorMap[notification.priority] || 'border-l-gray-300';

  const handleClick = useCallback(() => {
    if (!notification.is_read) {
      markAsReadMutation.mutate({ notificationId: notification.id });
    }
  }, [notification.id, notification.is_read, markAsReadMutation]);

  const formatTimestamp = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return t('justNow', { defaultValue: 'Just now' });
      }
      if (diffInHours < 24) {
        return t('hoursAgo', { count: diffInHours, defaultValue: `${diffInHours} hours ago` });
      }
      if (diffInHours < 48) {
        return t('yesterday', { defaultValue: 'Yesterday' });
      }
      // Format as "X days ago" for older notifications
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      }
      // For very old notifications, show the date
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  }, [t]);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
        !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
      } border-l-4 ${priorityColor}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 mt-1 ${iconColor}`}>
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${
                  !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                {notification.message}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <span className="text-xs text-gray-500 flex items-center space-x-1">
                <Clock size={12} />
                <span>{formatTimestamp(notification.timestamp)}</span>
              </span>

              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

