export interface PaymentData {
  id: string;
  transactionId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  method: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto';
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  fee: number;
  netAmount: number;
  gateway: string;
  gatewayTransactionId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  metadata?: Record<string, any>;
  subscription?: {
    id: string;
    plan: string;
    interval: 'monthly' | 'yearly';
  };
  invoice?: {
    id: string;
    number: string;
    url: string;
  };
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  refundedTransactions: number;
  averageTransactionValue: number;
  totalRefunds: number;
  conversionRate: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number;
  transactionsToday: number;
  transactionsThisWeek: number;
  transactionsThisMonth: number;
  topPaymentMethod: {
    method: string;
    count: number;
    percentage: number;
  };
  highestTransaction: {
    id: string;
    amount: number;
    customer: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto';
  enabled: boolean;
  icon: string;
  description: string;
  processingFee: number; // percentage
  fixedFee: number;
  supportedCurrencies: string[];
  settings?: Record<string, any>;
}

export interface Subscription {
  id: string;
  customerId: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    features: string[];
  };
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  cancelledAt?: string;
  pausedAt?: string;
  nextBillingDate: string;
  totalRevenue: number;
  paymentHistory: PaymentData[];
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
  customer: {
    name: string;
    email: string;
  };
}

export interface PaymentAnalytics {
  period: 'today' | 'week' | 'month' | 'year';
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  transactions: {
    current: number;
    previous: number;
    growth: number;
  };
  conversionRate: {
    current: number;
    previous: number;
    growth: number;
  };
  averageOrderValue: {
    current: number;
    previous: number;
    growth: number;
  };
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  dailyMetrics: Array<{
    date: string;
    revenue: number;
    transactions: number;
    conversionRate: number;
  }>;
}