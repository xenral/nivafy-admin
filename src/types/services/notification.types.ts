/**
 * Notification Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Enums ============

export enum NotificationType {
  OTP = 'otp',
  COMMENT = 'comment',
  LIKE_COMMENT = 'like_comment',
  REPLY_COMMENT = 'reply_comment',
  LIKE_POST = 'like_post',
  FOLLOW = 'follow',
  CHARGE = 'charge',
  MENTION_POST = 'mention_post',
  MENTION_COMMENT = 'mention_comment',
  TAG_POST = 'tag_post',
}

export enum NotificationMethod {
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
  NOTICE = 'notice',
}

// ============ Entities ============

export interface NotificationTemplate {
  _id: string;
  notificationType: NotificationType;
  notificationMethod: NotificationMethod;
  subject: string;
  pattern?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Notification {
  _id: string;
  userId: number | null;
  agentId: number | null;
  template: NotificationTemplate;
  referenceId: string;
  referenceType: string;
  referenceAction: string;
  params?: Record<string, any>;
  flgRead: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PushToken {
  _id: string;
  clientId: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============ Statistics ============

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  deliveryRate: number;
  totalTemplates: number;
  totalPushTokens: number;
}

export interface DeliveryMetrics {
  period: string;
  total: number;
  delivered: number;
  read: number;
  deliveryRate: number;
  openRate: number;
}

// ============ DTOs ============

export interface BroadcastNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  method?: NotificationMethod;
  userIds?: number[];
}

export interface CreateTemplateDto {
  notificationType: NotificationType;
  notificationMethod: NotificationMethod;
  subject: string;
  pattern?: string;
  externalId?: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  userId?: number;
  type?: NotificationType;
  method?: NotificationMethod;
  isRead?: boolean;
  search?: string;
}

export interface TemplateFilters {
  page?: number;
  limit?: number;
  type?: NotificationType;
  method?: NotificationMethod;
}

// ============ Response Types ============

export type NotificationsResponse = PaginatedResponse<Notification>;
export type TemplatesResponse = PaginatedResponse<NotificationTemplate>;
export type PushTokensResponse = PaginatedResponse<PushToken>;
