import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Notification Data
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

let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'tip',
    title: 'New Tip Received',
    message: 'You received a tip of $500 from table 5',
    priority: 'high',
    is_read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'system',
    title: 'System Update',
    message: 'Your restaurant profile has been updated successfully',
    priority: 'medium',
    is_read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'giftcard',
    title: 'Gift Card Used',
    message: 'A gift card was used at your restaurant',
    priority: 'low',
    is_read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'analytics',
    title: 'Weekly Report Available',
    message: 'Your weekly analytics report is ready to view',
    priority: 'medium',
    is_read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Some menu items are running low on stock',
    priority: 'high',
    is_read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'staff',
    title: 'New Staff Member Added',
    message: 'Maria Garcia has been added to your staff',
    priority: 'low',
    is_read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const notificationsRouter = router({
  getNotifications: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        per_page: z.number().default(10),
        filter: z.enum(['all', 'unread', 'read']).default('all'),
        notification_type: z.string().optional(),
        priority: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      await delay(500);
      console.log('[tRPC Notifications] getNotifications called with:', input);

      const page = input?.page || 1;
      const per_page = input?.per_page || 10;
      const filter = input?.filter || 'all';

      let filteredNotifications = [...mockNotifications];

      // Apply filter
      if (filter === 'unread') {
        filteredNotifications = filteredNotifications.filter((n) => !n.is_read);
      } else if (filter === 'read') {
        filteredNotifications = filteredNotifications.filter((n) => n.is_read);
      }

      // Apply type filter
      if (input?.notification_type) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.type === input.notification_type
        );
      }

      // Apply priority filter
      if (input?.priority) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.priority === input.priority
        );
      }

      // Sort by timestamp (newest first)
      filteredNotifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Paginate
      const total = filteredNotifications.length;
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

      return {
        data: paginatedNotifications,
        page,
        per_page,
        total,
        has_next: endIndex < total,
        has_prev: page > 1,
        unread_notifications: mockNotifications.filter((n) => !n.is_read).length,
      };
    }),

  markAsRead: publicProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC Notifications] markAsRead called with:', input);
      const notification = mockNotifications.find((n) => n.id === input.notificationId);
      if (notification) {
        notification.is_read = true;
        return { success: true, notification };
      }
      return { success: false, message: 'Notification not found' };
    }),

  markAllAsRead: publicProcedure.mutation(async () => {
    await delay(300);
    console.log('[tRPC Notifications] markAllAsRead called');
    mockNotifications.forEach((n) => {
      n.is_read = true;
    });
    return { success: true };
  }),

  getStats: publicProcedure.query(async () => {
    await delay(300);
    console.log('[tRPC Notifications] getStats called');
    const unreadCount = mockNotifications.filter((n) => !n.is_read).length;
    const totalCount = mockNotifications.length;
    const readCount = totalCount - unreadCount;

    return {
      unread_notifications: unreadCount,
      total_notifications: totalCount,
      read_notifications: readCount,
    };
  }),

  deleteNotification: publicProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => {
      await delay(300);
      console.log('[tRPC Notifications] deleteNotification called with:', input);
      const index = mockNotifications.findIndex((n) => n.id === input.notificationId);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Notification not found' };
    }),
});

