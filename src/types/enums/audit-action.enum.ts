/**
 * Audit Action Enum
 * Matches backend AuditActionEnum from account service
 */

export enum AuditActionEnum {
  // User Management
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_STATUS_CHANGED = 'USER_STATUS_CHANGED',
  USER_DELETED = 'USER_DELETED',
  USER_BANNED = 'USER_BANNED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_SHADOW_BANNED = 'USER_SHADOW_BANNED',
  USER_VERIFIED = 'USER_VERIFIED',
  USER_VERIFICATION_REVOKED = 'USER_VERIFICATION_REVOKED',

  // Content Moderation
  POST_DELETED = 'POST_DELETED',
  POST_QUARANTINED = 'POST_QUARANTINED',
  POST_RELEASED = 'POST_RELEASED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  COMMENT_QUARANTINED = 'COMMENT_QUARANTINED',

  // Reports & Strikes
  REPORT_REVIEWED = 'REPORT_REVIEWED',
  REPORT_DISMISSED = 'REPORT_DISMISSED',
  REPORT_ESCALATED = 'REPORT_ESCALATED',
  STRIKE_ISSUED = 'STRIKE_ISSUED',
  STRIKE_REMOVED = 'STRIKE_REMOVED',

  // System
  MAINTENANCE_MODE_CHANGED = 'MAINTENANCE_MODE_CHANGED',
  BULK_CONTENT_REMOVED = 'BULK_CONTENT_REMOVED',
  HASHTAG_BLOCKED = 'HASHTAG_BLOCKED',
  IP_BLOCKED = 'IP_BLOCKED',

  // DMCA
  DMCA_NOTICE_PROCESSED = 'DMCA_NOTICE_PROCESSED',
  DMCA_CONTENT_REMOVED = 'DMCA_CONTENT_REMOVED',

  // Wallet Actions (from wallet service)
  TRANSACTION_REFUNDED = 'TRANSACTION_REFUNDED',
  TRANSACTION_REVERSED = 'TRANSACTION_REVERSED',
  TRANSACTION_CANCELLED = 'TRANSACTION_CANCELLED',
  CREDITS_ADJUSTED = 'CREDITS_ADJUSTED',
  CREDITS_GRANTED = 'CREDITS_GRANTED',
  CREDITS_REVOKED = 'CREDITS_REVOKED',
  BONUS_CREDITS_GRANTED = 'BONUS_CREDITS_GRANTED',
  WALLET_FROZEN = 'WALLET_FROZEN',
  WALLET_UNFROZEN = 'WALLET_UNFROZEN',
  WALLET_BALANCE_ADJUSTED = 'WALLET_BALANCE_ADJUSTED',
  PAYMENT_DISPUTED = 'PAYMENT_DISPUTED',
  PAYMENT_DISPUTE_RESOLVED = 'PAYMENT_DISPUTE_RESOLVED',
  PAYMENT_CONFIG_CHANGED = 'PAYMENT_CONFIG_CHANGED',
  STRIPE_CONFIG_UPDATED = 'STRIPE_CONFIG_UPDATED',
  PRICING_UPDATED = 'PRICING_UPDATED',
  PAYMENT_GATEWAY_CHANGED = 'PAYMENT_GATEWAY_CHANGED',
}

// Helper function to get human-readable action labels
export const getAuditActionLabel = (action: AuditActionEnum): string => {
  const labels: Record<AuditActionEnum, string> = {
    // User Management
    [AuditActionEnum.USER_ROLE_CHANGED]: 'User Role Changed',
    [AuditActionEnum.USER_STATUS_CHANGED]: 'User Status Changed',
    [AuditActionEnum.USER_DELETED]: 'User Deleted',
    [AuditActionEnum.USER_BANNED]: 'User Banned',
    [AuditActionEnum.USER_SUSPENDED]: 'User Suspended',
    [AuditActionEnum.USER_SHADOW_BANNED]: 'User Shadow Banned',
    [AuditActionEnum.USER_VERIFIED]: 'User Verified',
    [AuditActionEnum.USER_VERIFICATION_REVOKED]: 'Verification Revoked',

    // Content Moderation
    [AuditActionEnum.POST_DELETED]: 'Post Deleted',
    [AuditActionEnum.POST_QUARANTINED]: 'Post Quarantined',
    [AuditActionEnum.POST_RELEASED]: 'Post Released',
    [AuditActionEnum.COMMENT_DELETED]: 'Comment Deleted',
    [AuditActionEnum.COMMENT_QUARANTINED]: 'Comment Quarantined',

    // Reports & Strikes
    [AuditActionEnum.REPORT_REVIEWED]: 'Report Reviewed',
    [AuditActionEnum.REPORT_DISMISSED]: 'Report Dismissed',
    [AuditActionEnum.REPORT_ESCALATED]: 'Report Escalated',
    [AuditActionEnum.STRIKE_ISSUED]: 'Strike Issued',
    [AuditActionEnum.STRIKE_REMOVED]: 'Strike Removed',

    // System
    [AuditActionEnum.MAINTENANCE_MODE_CHANGED]: 'Maintenance Mode Changed',
    [AuditActionEnum.BULK_CONTENT_REMOVED]: 'Bulk Content Removed',
    [AuditActionEnum.HASHTAG_BLOCKED]: 'Hashtag Blocked',
    [AuditActionEnum.IP_BLOCKED]: 'IP Blocked',

    // DMCA
    [AuditActionEnum.DMCA_NOTICE_PROCESSED]: 'DMCA Notice Processed',
    [AuditActionEnum.DMCA_CONTENT_REMOVED]: 'DMCA Content Removed',

    // Wallet Actions
    [AuditActionEnum.TRANSACTION_REFUNDED]: 'Transaction Refunded',
    [AuditActionEnum.TRANSACTION_REVERSED]: 'Transaction Reversed',
    [AuditActionEnum.TRANSACTION_CANCELLED]: 'Transaction Cancelled',
    [AuditActionEnum.CREDITS_ADJUSTED]: 'Credits Adjusted',
    [AuditActionEnum.CREDITS_GRANTED]: 'Credits Granted',
    [AuditActionEnum.CREDITS_REVOKED]: 'Credits Revoked',
    [AuditActionEnum.BONUS_CREDITS_GRANTED]: 'Bonus Credits Granted',
    [AuditActionEnum.WALLET_FROZEN]: 'Wallet Frozen',
    [AuditActionEnum.WALLET_UNFROZEN]: 'Wallet Unfrozen',
    [AuditActionEnum.WALLET_BALANCE_ADJUSTED]: 'Wallet Balance Adjusted',
    [AuditActionEnum.PAYMENT_DISPUTED]: 'Payment Disputed',
    [AuditActionEnum.PAYMENT_DISPUTE_RESOLVED]: 'Payment Dispute Resolved',
    [AuditActionEnum.PAYMENT_CONFIG_CHANGED]: 'Payment Config Changed',
    [AuditActionEnum.STRIPE_CONFIG_UPDATED]: 'Stripe Config Updated',
    [AuditActionEnum.PRICING_UPDATED]: 'Pricing Updated',
    [AuditActionEnum.PAYMENT_GATEWAY_CHANGED]: 'Payment Gateway Changed',
  };

  return labels[action] || action;
};

// Helper function to get action category
export const getAuditActionCategory = (action: AuditActionEnum): string => {
  if (action.startsWith('USER_')) return 'User Management';
  if (action.startsWith('POST_') || action.startsWith('COMMENT_')) return 'Content Moderation';
  if (action.startsWith('REPORT_') || action.startsWith('STRIKE_')) return 'Reports & Strikes';
  if (action.startsWith('DMCA_')) return 'DMCA';
  if (
    action.startsWith('TRANSACTION_') ||
    action.startsWith('CREDITS_') ||
    action.startsWith('WALLET_') ||
    action.startsWith('PAYMENT_') ||
    action.startsWith('BONUS_') ||
    action.startsWith('STRIPE_') ||
    action.startsWith('PRICING_')
  ) {
    return 'Wallet & Payments';
  }
  return 'System';
};
