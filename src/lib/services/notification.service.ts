/**
 * Notification Service API
 * All endpoints for notification management and broadcasting
 */

import api from '../api-client';
import {
  NotificationsResponse,
  NotificationStats,
  DeliveryMetrics,
  Notification,
  BroadcastNotificationDto,
  NotificationFilters,
} from '@/types/services/notification.types';
import { PaginationParams } from '@/types/nivafy';

const SERVICE = 'notification';

export const notificationService = {
  // ============ Statistics ============

  getStats: () =>
    api.get<NotificationStats>(SERVICE, '/admin/notifications/stats'),

  getDeliveryRate: () =>
    api.get<DeliveryMetrics>(SERVICE, '/admin/notifications/delivery-rate'),

  // ============ Notifications ============

  getNotifications: (params?: PaginationParams & NotificationFilters) =>
    api.get<NotificationsResponse>(SERVICE, '/admin/notifications', params),

  getNotificationById: (notificationId: string) =>
    api.get<Notification>(SERVICE, `/admin/notifications/notifications/${notificationId}`),

  deleteNotification: (notificationId: string) =>
    api.delete<void>(SERVICE, `/admin/notifications/notifications/${notificationId}`),

  // ============ Broadcasting (GOD only) ============

  broadcast: (data: BroadcastNotificationDto) =>
    api.post<void>(SERVICE, '/admin/notifications/broadcast', data),
};

export default notificationService;
