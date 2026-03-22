/**
 * Account Service Types
 */

import {
  User,
  Post,
  Comment,
  Report,
  Strike,
  AuditLog,
  PaginatedResponse,
  UserStatus,
  ReportType,
  ReportStatus,
  StrikeSeverity,
} from '../nivafy';

// ============ DTOs ============

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  cellphone: string;
  email?: string;
  password: string;
  username: string;
  birthDate: string;
  sex: 'male' | 'female' | 'not_said' | 'other';
  role?: number;
}

export interface ChangeUserPasswordDto {
  newPassword: string;
}

export interface UpdateUserDto {
  displayName?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface BanUserDto {
  reason: string;
  permanent?: boolean;
  durationDays?: number;
}

export interface SuspendUserDto {
  reason: string;
  durationDays: number;
}

export interface CreateStrikeDto {
  userId: string;
  severity: StrikeSeverity;
  reason: string;
  expiresInDays?: number;
}

export interface ReviewReportDto {
  action: 'approve' | 'reject';
  notes?: string;
}

// ============ Analytics ============

// Backend response structure
export interface DashboardAnalyticsResponse {
  users: {
    total: number;
    active: number;
    banned: number;
    suspended: number;
    verified: number;
    shadowBanned: number;
    newToday: number;
  };
  content: {
    totalPosts: number;
    totalComments: number;
    newPostsToday: number;
  };
}

// Frontend normalized structure
export interface DashboardAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  bannedUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  shadowBannedUsers: number;
  totalPosts: number;
  postsToday: number;
  totalComments: number;
  commentsToday: number;
}

export interface UserAnalytics {
  userId: string;
  user: User;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalFollowers: number;
  totalFollowing: number;
  accountAge: number;
  lastActive: string;
  reportCount: number;
  strikeCount: number;
}

// ============ Filter Interfaces ============

export interface UserFilters {
  role?: number;
  isVerified?: boolean;
  isBanned?: boolean;
  isSuspended?: boolean;
  isShadowBanned?: boolean;
  search?: string;
}

export interface PostFilters {
  userId?: string;
  isDeleted?: boolean;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  type?: ReportType;
  reportableType?: string;
  reporterId?: string;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}

// ============ Response Types ============

export type UsersResponse = PaginatedResponse<User>;
export type PostsResponse = PaginatedResponse<Post>;
export type CommentsResponse = PaginatedResponse<Comment>;
export type ReportsResponse = PaginatedResponse<Report>;
export type StrikesResponse = PaginatedResponse<Strike>;
export type AuditLogsResponse = PaginatedResponse<AuditLog>;
