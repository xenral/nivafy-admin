/**
 * Wallet Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  REFUND = 'REFUND',
  BONUS = 'BONUS',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Wallet extends BaseEntity {
  userId: string;
  user?: User;
  balance: number;
  currency: string;
  isFrozen: boolean;
  frozenAt?: string;
  frozenBy?: string;
  freezeReason?: string;
}

export interface Transaction extends BaseEntity {
  walletId: string;
  wallet?: Wallet;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  metadata?: Record<string, any>;
  refundedAt?: string;
  refundedBy?: string;
  refundReason?: string;
}

// ============ Statistics ============

export interface WalletStats {
  totalTransactions: number;
  totalRevenue: number;
  activeWallets: number;
  frozenWallets: number;
  totalCreditsInCirculation: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueGrowth: number;
  averageTransactionValue: number;
  revenueByDay: Array<{ date: string; revenue: number; transactions: number }>;
  revenueByType: Array<{ type: string; revenue: number; percentage: number }>;
}

// ============ DTOs ============

export interface RefundTransactionDto {
  reason: string;
}

export interface AdjustCreditsDto {
  amount: number;
  reason: string;
}

export interface GrantBonusCreditsDto {
  amount: number;
  reason: string;
}

export interface FreezeWalletDto {
  reason: string;
}

export interface TransactionFilters {
  userId?: string;
  walletId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}

export interface WalletFilters {
  userId?: string;
  isFrozen?: boolean;
  minBalance?: number;
  maxBalance?: number;
}

// ============ Response Types ============

export type TransactionsResponse = PaginatedResponse<Transaction>;
export type WalletsResponse = PaginatedResponse<Wallet>;
