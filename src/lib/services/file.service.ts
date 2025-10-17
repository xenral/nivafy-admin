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

  // ============ Files ============

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

  // ============ AI Generations ============

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
