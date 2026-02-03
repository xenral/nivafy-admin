/**
 * File Service API
 * All endpoints for file management and AI generation control
 */

import api from '../api-client';
import {
  FilesResponse,
  AIGenerationsResponse,
  AIBlockedUsersResponse,
  FileStats,
  FileEntity,
  AIGeneration,
  QuarantineFileDto,
  BlockAIAccessDto,
  FileFilters,
  AIGenerationFilters,
} from '@/types/services/file.types';
import { PaginationParams } from '@/types/nivafy';

const SERVICE = 'file';

export const fileService = {
  // ============ Statistics ============

  getStats: () =>
    api.get<FileStats>(SERVICE, '/admin/files/stats'),

  // ============ Images ============

  getImages: (params?: PaginationParams & { search?: string; userId?: number; includeDeleted?: boolean }) =>
    api.get(SERVICE, '/admin/files/images', params),

  getImageById: (imageId: string) =>
    api.get(SERVICE, `/admin/files/images/${imageId}`),

  softDeleteImage: (imageId: string) =>
    api.delete(SERVICE, `/admin/files/images/${imageId}/soft`),

  restoreImage: (imageId: string) =>
    api.post(SERVICE, `/admin/files/images/${imageId}/restore`),

  hardDeleteImage: (imageId: string) =>
    api.delete(SERVICE, `/admin/files/images/${imageId}/hard`),

  bulkDeleteImages: (imageIds: string[]) =>
    api.post(SERVICE, '/admin/files/images/bulk-delete', { imageIds }),

  // ============ Videos ============

  getVideos: (params?: PaginationParams & { search?: string; userId?: number; includeDeleted?: boolean }) =>
    api.get(SERVICE, '/admin/files/videos', params),

  softDeleteVideo: (videoId: string) =>
    api.delete(SERVICE, `/admin/files/videos/${videoId}/soft`),

  restoreVideo: (videoId: string) =>
    api.post(SERVICE, `/admin/files/videos/${videoId}/restore`),

  hardDeleteVideo: (videoId: string) =>
    api.delete(SERVICE, `/admin/files/videos/${videoId}/hard`),

  // ============ AI Images ============

  getAiImages: (params?: PaginationParams & { userId?: number; prompt?: string; model?: string }) =>
    api.get(SERVICE, '/admin/files/ai/images', params),

  deleteAiImage: (aiImageId: string) =>
    api.delete(SERVICE, `/admin/files/ai/images/${aiImageId}`),

  // ============ AI Conversations ============

  getAiConversations: (params?: PaginationParams & { userId?: number }) =>
    api.get(SERVICE, '/admin/files/ai/conversations', params),

  getAiConversationById: (conversationId: string) =>
    api.get(SERVICE, `/admin/files/ai/conversations/${conversationId}`),

  deleteAiConversation: (conversationId: string) =>
    api.delete(SERVICE, `/admin/files/ai/conversations/${conversationId}`),

  // ============ AI Models ============

  getAiModels: () =>
    api.get(SERVICE, '/admin/files/ai/models'),

  createAiModel: (data: { purpose: string; model: string; title: string; description?: string; instructions: string; icon?: string }) =>
    api.post(SERVICE, '/admin/files/ai/models', data),

  updateAiModel: (modelId: string, data: Partial<{ purpose: string; model: string; title: string; description?: string; instructions: string; icon?: string }>) =>
    api.put(SERVICE, `/admin/files/ai/models/${modelId}`, data),

  deleteAiModel: (modelId: string) =>
    api.delete(SERVICE, `/admin/files/ai/models/${modelId}`),

  // ============ AI Suggestions ============

  getAiSuggestions: () =>
    api.get(SERVICE, '/admin/files/ai/suggestions'),

  createAiSuggestion: (data: { text: string; order: number; modelId?: number }) =>
    api.post(SERVICE, '/admin/files/ai/suggestions', data),

  updateAiSuggestion: (
    suggestionId: string,
    data: Partial<{ text: string; order: number; modelId?: number }>,
  ) =>
    api.put(SERVICE, `/admin/files/ai/suggestions/${suggestionId}`, data),

  deleteAiSuggestion: (suggestionId: string) =>
    api.delete(SERVICE, `/admin/files/ai/suggestions/${suggestionId}`),

  // ============ Files (Legacy) ============

  getFiles: (params?: PaginationParams & FileFilters) =>
    api.get<FilesResponse>(SERVICE, '/admin/files/files', params),

  getFileById: (fileId: string) =>
    api.get<FileEntity>(SERVICE, `/admin/files/files/${fileId}`),

  deleteFile: (fileId: string) =>
    api.delete<void>(SERVICE, `/admin/files/files/${fileId}`),

  quarantineFile: (fileId: string, data: QuarantineFileDto) =>
    api.post<FileEntity>(SERVICE, `/admin/files/files/${fileId}/quarantine`, data),

  releaseFile: (fileId: string) =>
    api.post<FileEntity>(SERVICE, `/admin/files/files/${fileId}/release`),

  // ============ AI Generations (Legacy) ============

  getAIGenerations: (params?: PaginationParams & AIGenerationFilters) =>
    api.get<AIGenerationsResponse>(SERVICE, '/admin/files/ai/generations', params),

  getAIGenerationById: (generationId: string) =>
    api.get<AIGeneration>(SERVICE, `/admin/files/ai/generations/${generationId}`),

  // ============ AI Access Control ============

  blockAIAccess: (userId: string, data: BlockAIAccessDto) =>
    api.post<void>(SERVICE, `/admin/files/users/${userId}/ai/block`, data),

  unblockAIAccess: (userId: string) =>
    api.delete<void>(SERVICE, `/admin/files/users/${userId}/ai/block`),

  getBlockedUsers: (params?: PaginationParams) =>
    api.get<AIBlockedUsersResponse>(SERVICE, '/admin/files/ai/blocked-users', params),
};

export default fileService;
