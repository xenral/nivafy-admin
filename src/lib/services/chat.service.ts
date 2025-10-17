/**
 * Chat Service API
 * All endpoints for chat management and moderation
 */

import api from '../api-client';
import {
  MessagesResponse,
  ConversationsResponse,
  ChatMutesResponse,
  ChatStats,
  Message,
  Conversation,
  MuteUserDto,
  MessageFilters,
} from '@/types/services/chat.types';
import { PaginationParams } from '@/types/nivafy';

const SERVICE = 'chat';

export const chatService = {
  // ============ Statistics ============

  getStats: () =>
    api.get<ChatStats>(SERVICE, '/admin/chat/stats'),

  // ============ Messages ============

  getMessages: (params?: PaginationParams & MessageFilters) =>
    api.get<MessagesResponse>(SERVICE, '/admin/chat/messages', params),

  getMessageById: (messageId: string) =>
    api.get<Message>(SERVICE, `/admin/chat/messages/${messageId}`),

  deleteMessage: (messageId: string) =>
    api.delete<void>(SERVICE, `/admin/chat/messages/${messageId}`),

  // ============ Conversations ============

  getConversations: (params?: PaginationParams) =>
    api.get<ConversationsResponse>(SERVICE, '/admin/chat/conversations', params),

  getConversationById: (conversationId: string) =>
    api.get<Conversation>(SERVICE, `/admin/chat/conversations/${conversationId}`),

  deleteConversation: (conversationId: string) =>
    api.delete<void>(SERVICE, `/admin/chat/conversations/${conversationId}`),

  // ============ User Muting ============

  muteUser: (userId: string, data: MuteUserDto) =>
    api.post<void>(SERVICE, `/admin/chat/users/${userId}/mute`, data),

  unmuteUser: (userId: string) =>
    api.delete<void>(SERVICE, `/admin/chat/users/${userId}/mute`),

  getMutedUsers: (params?: PaginationParams) =>
    api.get<ChatMutesResponse>(SERVICE, '/admin/chat/muted-users', params),
};

export default chatService;
