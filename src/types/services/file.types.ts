/**
 * File Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export enum FileStatus {
  ACTIVE = 'ACTIVE',
  QUARANTINED = 'QUARANTINED',
  DELETED = 'DELETED',
}

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export interface FileEntity extends BaseEntity {
  userId: string;
  user?: User;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: FileType;
  status: FileStatus;
  url: string;
  thumbnailUrl?: string;
  quarantinedAt?: string;
  quarantinedBy?: string;
  quarantineReason?: string;
}

export interface AIGeneration extends BaseEntity {
  userId: string;
  user?: User;
  prompt: string;
  model: string;
  resultUrl?: string;
  fileId?: string;
  file?: FileEntity;
  cost: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
}

export interface AIBlockedUser extends BaseEntity {
  userId: string;
  user?: User;
  blockedBy: string;
  blockedByUser?: User;
  reason: string;
  isActive: boolean;
}

// ============ Statistics ============

export interface FileStats {
  totalFiles: number;
  filesToday: number;
  totalSize: number;
  quarantinedFiles: number;
  deletedFiles: number;
  totalAIGenerations: number;
  aiGenerationsToday: number;
  totalAICost: number;
  filesByType: Array<{ type: FileType; count: number; size: number }>;
  storageByUser: Array<{ userId: string; username: string; fileCount: number; totalSize: number }>;
}

// ============ DTOs ============

export interface QuarantineFileDto {
  reason: string;
}

export interface BlockAIAccessDto {
  reason: string;
}

export interface FileFilters {
  userId?: string;
  type?: FileType;
  status?: FileStatus;
  search?: string;
  minSize?: number;
  maxSize?: number;
  startDate?: string;
  endDate?: string;
}

export interface AIGenerationFilters {
  userId?: string;
  status?: string;
  model?: string;
  startDate?: string;
  endDate?: string;
}

// ============ Response Types ============

export type FilesResponse = PaginatedResponse<FileEntity>;
export type AIGenerationsResponse = PaginatedResponse<AIGeneration>;
export type AIBlockedUsersResponse = PaginatedResponse<AIBlockedUser>;
