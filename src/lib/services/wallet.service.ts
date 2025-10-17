/**
 * Wallet Service API
 * All endpoints for wallet and transaction management
 */

import api from '../api-client';
import {
  TransactionsResponse,
  WalletsResponse,
  WalletStats,
  RevenueAnalytics,
  Transaction,
  Wallet,
  RefundTransactionDto,
  AdjustCreditsDto,
  GrantBonusCreditsDto,
  FreezeWalletDto,
  TransactionFilters,
  WalletFilters,
  AnalyticsPeriod,
} from '@/types/services/wallet.types';
import { PaginationParams } from '@/types/nivafy';

const SERVICE = 'wallet';

export const walletService = {
  // ============ Statistics ============

  getStats: () =>
    api.get<WalletStats>(SERVICE, '/admin/wallet/stats'),

  getRevenue: (period?: AnalyticsPeriod) =>
    api.get<RevenueAnalytics>(SERVICE, '/admin/wallet/revenue', period ? { period } : undefined),

  // ============ Transactions ============

  getTransactions: (params?: PaginationParams & TransactionFilters) =>
    api.get<TransactionsResponse>(SERVICE, '/admin/wallet/transactions', params),

  getTransactionById: (transactionId: string) =>
    api.get<Transaction>(SERVICE, `/admin/wallet/transactions/${transactionId}`),

  refundTransaction: (transactionId: string, data: RefundTransactionDto) =>
    api.post<Transaction>(SERVICE, `/admin/wallet/transactions/${transactionId}/refund`, data),

  // ============ Wallets ============

  getWallets: (params?: PaginationParams & WalletFilters) =>
    api.get<WalletsResponse>(SERVICE, '/admin/wallet/wallets', params),

  getWalletById: (walletId: string) =>
    api.get<Wallet>(SERVICE, `/admin/wallet/wallets/${walletId}`),

  getUserWallet: (userId: string) =>
    api.get<Wallet>(SERVICE, `/admin/wallet/users/${userId}/wallet`),

  freezeWallet: (userId: string, data: FreezeWalletDto) =>
    api.post<Wallet>(SERVICE, `/admin/wallet/users/${userId}/wallet/freeze`, data),

  unfreezeWallet: (userId: string) =>
    api.post<Wallet>(SERVICE, `/admin/wallet/users/${userId}/wallet/unfreeze`),

  // ============ Credit Management (GOD only) ============

  adjustCredits: (userId: string, data: AdjustCreditsDto) =>
    api.post<Wallet>(SERVICE, `/admin/wallet/users/${userId}/credits/adjust`, data),

  grantBonusCredits: (userId: string, data: GrantBonusCreditsDto) =>
    api.post<Wallet>(SERVICE, `/admin/wallet/users/${userId}/credits/grant`, data),
};

export default walletService;
