/**
 * Account Service API
 * All endpoints for user management, moderation, reports, and audit logs
 */

import api from '../api-client';
import {
  UsersResponse,
  PostsResponse,
  CommentsResponse,
  ReportsResponse,
  StrikesResponse,
  AuditLogsResponse,
  DashboardAnalytics,
  DashboardAnalyticsResponse,
  UserAnalytics,
  UpdateUserDto,
  BanUserDto,
  SuspendUserDto,
  CreateStrikeDto,
  ReviewReportDto,
  UserFilters,
  PostFilters,
  ReportFilters,
  AuditLogFilters,
  CreateUserDto,
  ChangeUserPasswordDto,
} from '@/types/services/account.types';
import { User, Post, Comment, Report, Strike, PaginationParams } from '@/types/nivafy';

const SERVICE = 'account';

// ============ Authentication ============

export interface LoginDto {
  clientId: string;
  cellphone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDto {
  clientId: string;
  firstName: string;
  lastName: string;
  cellphone: string;
  password: string;
  username: string;
  birthDate: string; // ISO date string
  sex: 'male' | 'female' | 'other';
}

export interface VerifyRegisterDto extends RegisterDto {
  phoneOtpCode: string;
}

export interface VerifyRegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export const accountService = {
  // Auth
  login: (data: LoginDto) =>
    api.post<LoginResponse>(SERVICE, '/auth/login', data),

  register: (data: RegisterDto) =>
    api.post<void>(SERVICE, '/auth/register', data),

  verifyRegister: (data: VerifyRegisterDto) =>
    api.post<VerifyRegisterResponse>(SERVICE, '/auth/register/verify', data),

  getUserInfo: () =>
    api.get<User>(SERVICE, '/user/info'),

  // ============ Dashboard Analytics ============

  getDashboard: async (): Promise<DashboardAnalytics> => {
    const response = await api.get<DashboardAnalyticsResponse>(SERVICE, '/admin/analytics/dashboard');
    
    // Transform backend response to frontend structure
    return {
      totalUsers: response.users.total,
      activeUsers: response.users.active,
      newUsersToday: response.users.newToday,
      bannedUsers: response.users.banned,
      suspendedUsers: response.users.suspended,
      verifiedUsers: response.users.verified,
      shadowBannedUsers: response.users.shadowBanned,
      totalPosts: response.content.totalPosts,
      postsToday: response.content.newPostsToday,
      totalComments: response.content.totalComments,
      commentsToday: 0, // Not provided by backend yet
    };
  },

  // ============ User Management ============

  createUser: (data: CreateUserDto) =>
    api.post<{ message: string; userId: number }>(SERVICE, '/admin/users', data),

  getUsers: (params?: PaginationParams & UserFilters) =>
    api.get<UsersResponse>(SERVICE, '/admin/users', params),

  getUserById: (userId: number) =>
    api.get<User>(SERVICE, `/admin/users/${userId}`),

  changeUserPassword: (userId: number, data: ChangeUserPasswordDto) =>
    api.put<{ message: string }>(SERVICE, `/admin/users/${userId}/password`, data),

  updateUser: (userId: number, data: UpdateUserDto) =>
    api.patch<User>(SERVICE, `/admin/users/${userId}`, data),

  deleteUser: (userId: number) =>
    api.delete<void>(SERVICE, `/admin/users/${userId}`),

  banUser: (userId: number, data: BanUserDto) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/ban`, data),

  unbanUser: (userId: number) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/unban`),

  suspendUser: (userId: number, data: SuspendUserDto) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/suspend`, data),

  unsuspendUser: (userId: number) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/unsuspend`),

  shadowBanUser: (userId: number, reason: string) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/shadow-ban`, { reason }),

  removeShadowBan: (userId: number) =>
    api.delete<User>(SERVICE, `/admin/users/${userId}/shadow-ban`),

  verifyUser: (userId: number) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/verify`),

  unverifyUser: (userId: number) =>
    api.post<User>(SERVICE, `/admin/users/${userId}/unverify`),

  getUserAnalytics: (userId: number) =>
    api.get<UserAnalytics>(SERVICE, `/admin/users/${userId}/analytics`),

  // ============ Post Management ============

  getPosts: (params?: PaginationParams & { search?: string; type?: string; isDeleted?: boolean }) =>
    api.get<PostsResponse>(SERVICE, '/admin/posts', params),

  getPostById: (postId: number) =>
    api.get<Post>(SERVICE, `/admin/posts/${postId}`),

  deletePost: (postId: number) =>
    api.delete<void>(SERVICE, `/admin/posts/${postId}`),

  restorePost: (postId: number) =>
    api.post<Post>(SERVICE, `/admin/posts/${postId}/restore`),

  // ============ Comment Management ============

  getComments: (params?: PaginationParams & { postId?: number; search?: string; isDeleted?: boolean }) =>
    api.get<CommentsResponse>(SERVICE, '/admin/comments', params),

  getCommentById: (commentId: number) =>
    api.get<Comment>(SERVICE, `/admin/comments/${commentId}`),

  deleteComment: (commentId: number) =>
    api.delete<void>(SERVICE, `/admin/comments/${commentId}`),

  restoreComment: (commentId: number) =>
    api.post<Comment>(SERVICE, `/admin/comments/${commentId}/restore`),

  // ============ Reports ============

  getReports: (params?: PaginationParams & { status?: string; type?: string }) =>
    api.get<ReportsResponse>(SERVICE, '/moderation/reports/queue', params),

  getReportById: (reportId: number) =>
    api.get<Report>(SERVICE, `/moderation/reports/${reportId}`),

  markReportUnderReview: (reportId: number) =>
    api.put<Report>(SERVICE, `/moderation/reports/${reportId}/review`),

  takeActionOnReport: (reportId: number, data: { action: string; notes: string }) =>
    api.post<Report>(SERVICE, `/moderation/reports/${reportId}/action`, data),

  dismissReport: (reportId: number, notes: string) =>
    api.put<Report>(SERVICE, `/moderation/reports/${reportId}/dismiss`, { notes }),

  escalateReport: (reportId: number, notes: string) =>
    api.put<Report>(SERVICE, `/moderation/reports/${reportId}/escalate`, { notes }),

  // ============ Strikes ============

  getAllStrikes: (params?: PaginationParams & { userId?: number; isActive?: boolean }) =>
    api.get<StrikesResponse>(SERVICE, '/moderation/strikes', params),

  getUserStrikes: (userId: number) =>
    api.get<StrikesResponse>(SERVICE, `/moderation/users/${userId}/strikes`),

  issueStrike: (userId: number, data: { 
    reason: string; 
    severity: string; 
    description: string;
    relatedReportId?: number;
    relatedPostId?: number;
    relatedCommentId?: number;
  }) =>
    api.post<Strike>(SERVICE, `/moderation/users/${userId}/strike`, data),

  removeStrike: (userId: number, strikeId: number) =>
    api.delete<void>(SERVICE, `/moderation/users/${userId}/strike/${strikeId}`),

  // ============ Audit Logs (GOD only) ============

  getAuditLogs: (params?: PaginationParams & { action?: string; adminId?: number; targetUserId?: number }) =>
    api.get<AuditLogsResponse>(SERVICE, '/admin/audit-logs', params),
};

export default accountService;
