/**
 * Chat Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export interface Message extends BaseEntity {
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  isDeleted: boolean;
  isEdited: boolean;
  attachments?: string[];
}

export interface Conversation extends BaseEntity {
  participantIds: string[];
  participants?: User[];
  lastMessage?: Message;
  lastMessageAt: string;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface ChatMute extends BaseEntity {
  userId: string;
  user?: User;
  mutedBy: string;
  mutedByUser?: User;
  reason: string;
  expiresAt?: string;
  isActive: boolean;
}

// ============ Statistics ============

export interface ChatStats {
  totalMessages: number;
  messagesToday: number;
  totalConversations: number;
  conversationsToday: number;
  activeConversations: number;
  totalMutedUsers: number;
  deletedMessagesToday: number;
  messagesByHour: Array<{ hour: number; count: number }>;
  topActiveUsers: Array<{ userId: string; username: string; messageCount: number }>;
}

// ============ DTOs ============

export interface MuteUserDto {
  reason: string;
  durationHours?: number;
}

export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  isDeleted?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// ============ Response Types ============

export type MessagesResponse = PaginatedResponse<Message>;
export type ConversationsResponse = PaginatedResponse<Conversation>;
export type ChatMutesResponse = PaginatedResponse<ChatMute>;
