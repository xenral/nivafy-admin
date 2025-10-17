/**
 * Wallet Service Types
 */

import { BaseEntity, User, PaginatedResponse } from '../nivafy';

// ============ Entities ============

export enum TransactionType {
  CHARGE = 1,
  AI_IMAGE = 2,
  AI_CONVERSATION = 3,
  SUBSCRIPTION = 4,
  MANUAL = 5,
}

export enum TransactionStatus {
  FREEZED = 1,
  FAILURE = 2,
  COMPLETED = 3,
}

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all',
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
  userId: number;
  assetId: number;
  asset?: Asset;
  type: TransactionType;
  amount: string;
  status: TransactionStatus;
  orderId: string;
  frozenExpiresIn?: string;
}

export interface Asset extends BaseEntity {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Balance extends BaseEntity {
  userId: number;
  assetId: number;
  asset?: Asset;
  amount: string;
  available: string;
  frozen: string;
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
  period: AnalyticsPeriod;
  totalRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  chartData: Array<{ date: string; revenue: number; transactions: number }>;
  topSpenders: Array<{ userId: number; totalSpent: number; transactionCount: number }>;
  revenueByType: Array<{ type: string; revenue: number; count: number; percentage: number }>;
}

// ============ DTOs ============

export interface RefundTransactionDto {
  reason: string;
}

export interface AdjustCreditsDto {
  amount: number;
  reason: string;
  assetId?: number;
}

export interface GrantBonusCreditsDto {
  amount: number;
  reason: string;
  assetId?: number;
}

export interface FreezeWalletDto {
  reason: string;
  assetId?: number;
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
export type WalletsResponse = PaginatedResponse<Balance>;
export type BalancesResponse = PaginatedResponse<Balance>;
