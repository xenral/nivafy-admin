/**
 * Notification Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  USER_ACTION = 'USER_ACTION',
  BROADCAST = 'BROADCAST',
  ALERT = 'ALERT',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  READ = 'READ',
}

export interface Notification extends BaseEntity {
  userId: string;
  user?: User;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  readAt?: string;
  sentAt?: string;
  data?: Record<string, any>;
  isBroadcast: boolean;
}

// ============ Statistics ============

export interface NotificationStats {
  totalNotifications: number;
  notificationsToday: number;
  sentNotifications: number;
  failedNotifications: number;
  pendingNotifications: number;
  readRate: number;
  deliveryRate: number;
  notificationsByType: Array<{ type: NotificationType; count: number }>;
  notificationsByHour: Array<{ hour: number; sent: number; failed: number }>;
}

export interface DeliveryMetrics {
  totalSent: number;
  totalFailed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  failureReasons: Array<{ reason: string; count: number }>;
}

// ============ DTOs ============

export interface BroadcastNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  data?: Record<string, any>;
  targetUserIds?: string[];
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  isBroadcast?: boolean;
  startDate?: string;
  endDate?: string;
}

// ============ Response Types ============

export type NotificationsResponse = PaginatedResponse<Notification>;
