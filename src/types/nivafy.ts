/**
 * Core Nivafy types shared across all services
 */

// ============ Enums ============

export enum UserRole {
  USER = 0,
  ADMIN = 1,
  GOD = 2,
}

export enum ReportType {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  VIOLENCE = 'VIOLENCE',
  NUDITY = 'NUDITY',
  MISINFORMATION = 'MISINFORMATION',
  COPYRIGHT = 'COPYRIGHT',
  TERRORISM = 'TERRORISM',
  SELF_HARM = 'SELF_HARM',
  CHILD_SAFETY = 'CHILD_SAFETY',
  FAKE_ACCOUNT = 'FAKE_ACCOUNT',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
  ESCALATED = 'ESCALATED',
}

export enum StrikeReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  VIOLENCE = 'VIOLENCE',
  NUDITY = 'NUDITY',
  COPYRIGHT = 'COPYRIGHT',
  MISINFORMATION = 'MISINFORMATION',
  COMMUNITY_GUIDELINES = 'COMMUNITY_GUIDELINES',
}

export enum StrikeSeverity {
  WARNING = 'WARNING', // 0 points
  MINOR = 'MINOR', // 1 point
  MODERATE = 'MODERATE', // 2 points
  SEVERE = 'SEVERE', // 3 points - Auto-suspend
  CRITICAL = 'CRITICAL', // Immediate ban
}

export enum ReportableType {
  USER = 'USER',
  POST = 'POST',
  COMMENT = 'COMMENT',
  MESSAGE = 'MESSAGE',
}

export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  SUSPENDED = 2,
  BANNED = 3,
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BAN = 'BAN',
  UNBAN = 'UNBAN',
  VERIFY = 'VERIFY',
  SUSPEND = 'SUSPEND',
  UNSUSPEND = 'UNSUSPEND',
  SHADOW_BAN = 'SHADOW_BAN',
  REMOVE_SHADOW_BAN = 'REMOVE_SHADOW_BAN',
  APPROVE_REPORT = 'APPROVE_REPORT',
  REJECT_REPORT = 'REJECT_REPORT',
  ADD_STRIKE = 'ADD_STRIKE',
  REMOVE_STRIKE = 'REMOVE_STRIKE',
}

// ============ Base Interfaces ============

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  cellphone: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  sex: string;
  bio?: string;
  websiteUrl?: string;
  avatar?: string;
  banner?: string;
  isPrivate: boolean;
  role: UserRole;
  status: UserStatus;
  followersCount: number;
  followingCount: number;
  
  // Verification fields
  isVerified: boolean;
  verificationType?: string;
  verifiedAt?: string;
  
  // Moderation fields
  isShadowBanned: boolean;
  shadowBannedAt?: string;
  shadowBanReason?: string;
  shadowBannedBy?: number;
  suspendedUntil?: string;
  suspensionReason?: string;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: number;
  
  // Computed fields
  postsCount?: number;
}

export interface PostSlide {
  id: string;
  media: {
    metadata: {
      id: string;
      name: string;
      url: string;
      width: number;
      height: number;
      thumbnails: {
        name: string;
        url: string;
        width: number;
        height: number;
      }[];
    };
    type: 'image' | 'video';
  };
}

export interface Post extends BaseEntity {
  userId: number;
  user?: User;
  description?: string;
  slides: PostSlide[];
  type: 'POST' | 'REEL';
  isPrivate: boolean;
  isDeleted?: boolean;
  likesCount: number;
  commentsCount: number;
  location?: any;
}

export interface Comment extends BaseEntity {
  postId: number;
  post?: Post;
  userId: number;
  user?: User;
  text: string;
  parentCommentId?: number;
  isDeleted: boolean;
  likesCount: number;
  repliesCount?: number;
}

export interface Report extends BaseEntity {
  reportableType: ReportableType;
  reportableId: string;
  reporterId: string;
  reporter?: User;
  type: ReportType;
  description?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface Strike extends BaseEntity {
  userId: number;
  user?: User;
  reason: StrikeReason;
  severity: StrikeSeverity;
  description: string;
  isActive: boolean;
  expiresAt?: string;
  issuedBy: number;
  issuedByAdmin?: User;
  points: number;
  relatedReportId?: number;
  relatedPostId?: number;
  relatedCommentId?: number;
}

export interface AuditLog extends BaseEntity {
  adminId: number;
  admin?: User;
  action: AuditAction;
  targetUserId?: number;
  targetUser?: User;
  details?: any;
  metadata?: any;
  ipAddress?: string;
}

// ============ Pagination ============

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ API Response ============

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}
