import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { PaymentData, PaymentStats, PaymentMethod, Subscription, Refund } from '@/types/payments';

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'PM-001',
    name: 'Credit Card',
    type: 'credit_card',
    enabled: true,
    icon: 'credit-card',
    description: 'Visa, Mastercard, American Express',
    processingFee: 2.9,
    fixedFee: 0.30,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
  },
  {
    id: 'PM-002',
    name: 'PayPal',
    type: 'paypal',
    enabled: true,
    icon: 'paypal',
    description: 'PayPal payments and PayPal Credit',
    processingFee: 3.49,
    fixedFee: 0.49,
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
  },
  {
    id: 'PM-003',
    name: 'Stripe',
    type: 'stripe',
    enabled: true,
    icon: 'stripe',
    description: 'Stripe payment processing',
    processingFee: 2.9,
    fixedFee: 0.30,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
  },
  {
    id: 'PM-004',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    enabled: false,
    icon: 'bank',
    description: 'Direct bank transfers (ACH)',
    processingFee: 0.8,
    fixedFee: 0.00,
    supportedCurrencies: ['USD'],
  },
];

export const paymentStatuses = [
  'All Status',
  'Completed',
  'Pending',
  'Failed',
  'Refunded',
  'Cancelled',
] as const;

export const paymentsData: PaymentData[] = [
  {
    id: 'PAY-001',
    transactionId: 'txn_1234567890',
    customer: {
      id: 'CUST-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face',
    },
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    method: 'credit_card',
    description: 'Pro Plan Subscription - Monthly',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:31:00Z',
    completedAt: '2024-01-20T14:31:00Z',
    fee: 1.17,
    netAmount: 28.82,
    gateway: 'Stripe',
    gatewayTransactionId: 'pi_1234567890',
    subscription: {
      id: 'SUB-001',
      plan: 'Pro Plan',
      interval: 'monthly',
    },
    invoice: {
      id: 'INV-001',
      number: 'INV-2024-001',
      url: '/invoices/inv-2024-001.pdf',
    },
  },
  {
    id: 'PAY-002',
    transactionId: 'txn_1234567891',
    customer: {
      id: 'CUST-002',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    },
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    method: 'paypal',
    description: 'Enterprise Plan Subscription - Monthly',
    createdAt: '2024-01-19T16:15:00Z',
    updatedAt: '2024-01-19T16:16:00Z',
    completedAt: '2024-01-19T16:16:00Z',
    fee: 3.38,
    netAmount: 96.61,
    gateway: 'PayPal',
    gatewayTransactionId: 'PAY-1234567891',
    subscription: {
      id: 'SUB-002',
      plan: 'Enterprise Plan',
      interval: 'monthly',
    },
  },
  {
    id: 'PAY-003',
    transactionId: 'txn_1234567892',
    customer: {
      id: 'CUST-003',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    },
    amount: 15.99,
    currency: 'USD',
    status: 'failed',
    method: 'credit_card',
    description: 'Basic Plan Subscription - Monthly',
    createdAt: '2024-01-18T10:45:00Z',
    updatedAt: '2024-01-18T10:46:00Z',
    fee: 0,
    netAmount: 0,
    gateway: 'Stripe',
  },
  {
    id: 'PAY-004',
    transactionId: 'txn_1234567893',
    customer: {
      id: 'CUST-004',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    },
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    method: 'credit_card',
    description: 'Pro Plan Subscription - Yearly',
    createdAt: '2024-01-17T09:20:00Z',
    updatedAt: '2024-01-17T09:21:00Z',
    completedAt: '2024-01-17T09:21:00Z',
    fee: 9.00,
    netAmount: 290.99,
    gateway: 'Stripe',
    gatewayTransactionId: 'pi_1234567893',
    subscription: {
      id: 'SUB-004',
      plan: 'Pro Plan',
      interval: 'yearly',
    },
  },
  {
    id: 'PAY-005',
    transactionId: 'txn_1234567894',
    customer: {
      id: 'CUST-005',
      name: 'Eva Brown',
      email: 'eva.brown@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
    },
    amount: 49.99,
    currency: 'USD',
    status: 'pending',
    method: 'bank_transfer',
    description: 'Premium Plan Subscription - Monthly',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    fee: 0.40,
    netAmount: 49.59,
    gateway: 'ACH',
  },
  {
    id: 'PAY-006',
    transactionId: 'txn_1234567895',
    customer: {
      id: 'CUST-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face',
    },
    amount: 29.99,
    currency: 'USD',
    status: 'refunded',
    method: 'credit_card',
    description: 'Pro Plan Subscription - Monthly (Refunded)',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    completedAt: '2024-01-15T08:31:00Z',
    refundedAt: '2024-01-16T14:20:00Z',
    refundAmount: 29.99,
    fee: 1.17,
    netAmount: -1.17, // Fee lost due to refund
    gateway: 'Stripe',
    gatewayTransactionId: 'pi_1234567895',
  },
];

export const paymentStats: PaymentStats = {
  totalRevenue: 147856.43,
  totalTransactions: 2847,
  successfulTransactions: 2563,
  failedTransactions: 234,
  pendingTransactions: 32,
  refundedTransactions: 18,
  averageTransactionValue: 51.92,
  totalRefunds: 2847.89,
  conversionRate: 94.2,
  revenueThisMonth: 23456.78,
  revenueLastMonth: 19234.56,
  revenueGrowth: 21.9,
  transactionsToday: 47,
  transactionsThisWeek: 234,
  transactionsThisMonth: 892,
  topPaymentMethod: {
    method: 'Credit Card',
    count: 1847,
    percentage: 72.1,
  },
  highestTransaction: {
    id: 'PAY-004',
    amount: 299.99,
    customer: 'David Wilson',
  },
};

// Icon mappings for better performance
export const paymentStatusIconMap = new Map([
  ['completed', CheckCircle2],
  ['pending', Clock],
  ['failed', XCircle],
  ['refunded', RefreshCw],
  ['cancelled', Ban],
]);

export const paymentStatusColorMap = new Map([
  ['completed', 'default'],
  ['pending', 'outline'],
  ['failed', 'destructive'],
  ['refunded', 'secondary'],
  ['cancelled', 'secondary'],
]) as Map<string, string>;

export const paymentMethodIconMap = new Map([
  ['credit_card', CreditCard],
  ['debit_card', CreditCard],
  ['paypal', DollarSign],
  ['stripe', CreditCard],
  ['bank_transfer', DollarSign],
  ['crypto', DollarSign],
]);

// Sample subscriptions data
export const subscriptionsData: Subscription[] = [
  {
    id: 'SUB-001',
    customerId: 'CUST-001',
    customer: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face',
    },
    plan: {
      id: 'PLAN-001',
      name: 'Pro Plan',
      price: 29.99,
      currency: 'USD',
      interval: 'monthly',
      features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
    },
    status: 'active',
    currentPeriodStart: '2024-01-20T00:00:00Z',
    currentPeriodEnd: '2024-02-20T00:00:00Z',
    createdAt: '2023-06-15T10:30:00Z',
    nextBillingDate: '2024-02-20T00:00:00Z',
    totalRevenue: 239.92, // 8 months
    paymentHistory: [], // Would contain related payments
  },
  {
    id: 'SUB-002',
    customerId: 'CUST-002',
    customer: {
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    },
    plan: {
      id: 'PLAN-002',
      name: 'Enterprise Plan',
      price: 99.99,
      currency: 'USD',
      interval: 'monthly',
      features: ['Everything in Pro', 'Custom integrations', 'Dedicated support'],
    },
    status: 'active',
    currentPeriodStart: '2024-01-19T00:00:00Z',
    currentPeriodEnd: '2024-02-19T00:00:00Z',
    createdAt: '2023-08-10T14:20:00Z',
    nextBillingDate: '2024-02-19T00:00:00Z',
    totalRevenue: 599.94, // 6 months
    paymentHistory: [],
  },
];

// Sample refunds data
export const refundsData: Refund[] = [
  {
    id: 'REF-001',
    paymentId: 'PAY-006',
    amount: 29.99,
    currency: 'USD',
    reason: 'Customer requested refund within trial period',
    status: 'completed',
    createdAt: '2024-01-16T14:15:00Z',
    completedAt: '2024-01-16T14:20:00Z',
    customer: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
  },
];

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const gateways = [
  'All Gateways',
  'Stripe',
  'PayPal',
  'Square',
  'ACH',
  'Wire Transfer',
];