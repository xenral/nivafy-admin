import { PaymentData, PaymentStats } from '@/types/payments';

/**
 * Format currency amount with symbol
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  };

  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Format payment date
 */
export const formatPaymentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format transaction ID for display
 */
export const formatTransactionId = (transactionId: string): string => {
  if (transactionId.length <= 12) return transactionId;
  return `${transactionId.substring(0, 6)}...${transactionId.substring(transactionId.length - 6)}`;
};

/**
 * Calculate processing fee
 */
export const calculateProcessingFee = (
  amount: number,
  feePercentage: number,
  fixedFee: number = 0
): number => {
  return (amount * feePercentage / 100) + fixedFee;
};

/**
 * Calculate net amount after fees
 */
export const calculateNetAmount = (
  amount: number,
  feePercentage: number,
  fixedFee: number = 0
): number => {
  const processingFee = calculateProcessingFee(amount, feePercentage, fixedFee);
  return amount - processingFee;
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (method: string): string => {
  const methodNames: Record<string, string> = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    paypal: 'PayPal',
    stripe: 'Stripe',
    bank_transfer: 'Bank Transfer',
    crypto: 'Cryptocurrency',
  };

  return methodNames[method] || method;
};

/**
 * Get payment status display name
 */
export const getPaymentStatusName = (status: string): string => {
  const statusNames: Record<string, string> = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
    cancelled: 'Cancelled',
  };

  return statusNames[status] || status;
};

/**
 * Filter payments by various criteria
 */
export const filterPayments = (
  payments: PaymentData[],
  filters: {
    search?: string;
    status?: string;
    method?: string;
    gateway?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
  }
): PaymentData[] => {
  return payments.filter((payment) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        payment.transactionId.toLowerCase().includes(searchTerm) ||
        payment.customer.name.toLowerCase().includes(searchTerm) ||
        payment.customer.email.toLowerCase().includes(searchTerm) ||
        payment.description.toLowerCase().includes(searchTerm) ||
        payment.gateway.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && filters.status !== 'All Status') {
      if (payment.status !== filters.status.toLowerCase()) return false;
    }

    // Method filter
    if (filters.method && filters.method !== 'all' && filters.method !== 'All Methods') {
      if (payment.method !== filters.method.toLowerCase().replace(' ', '_')) return false;
    }

    // Gateway filter
    if (filters.gateway && filters.gateway !== 'all' && filters.gateway !== 'All Gateways') {
      if (payment.gateway !== filters.gateway) return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const paymentDate = new Date(payment.createdAt);
      const fromDate = new Date(filters.dateFrom);
      if (paymentDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const paymentDate = new Date(payment.createdAt);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (paymentDate > toDate) return false;
    }

    // Amount range filter
    if (filters.minAmount !== undefined && payment.amount < filters.minAmount) {
      return false;
    }

    if (filters.maxAmount !== undefined && payment.amount > filters.maxAmount) {
      return false;
    }

    return true;
  });
};

/**
 * Sort payments by various criteria
 */
export const sortPayments = (
  payments: PaymentData[],
  sortBy: 'createdAt' | 'amount' | 'customer' | 'status' | 'method',
  order: 'asc' | 'desc' = 'desc'
): PaymentData[] => {
  return [...payments].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'customer':
        aValue = a.customer.name.toLowerCase();
        bValue = b.customer.name.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'method':
        aValue = a.method;
        bValue = b.method;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    const numA = Number(aValue);
    const numB = Number(bValue);
    
    return order === 'asc' ? numA - numB : numB - numA;
  });
};

/**
 * Calculate payment statistics
 */
export const calculatePaymentStats = (payments: PaymentData[]): PaymentStats => {
  const totalTransactions = payments.length;
  const successfulTransactions = payments.filter(p => p.status === 'completed').length;
  const failedTransactions = payments.filter(p => p.status === 'failed').length;
  const pendingTransactions = payments.filter(p => p.status === 'pending').length;
  const refundedTransactions = payments.filter(p => p.status === 'refunded').length;

  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
  const totalRefunds = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, payment) => sum + (payment.refundAmount || 0), 0);

  const averageTransactionValue = completedPayments.length > 0 
    ? completedPayments.reduce((sum, payment) => sum + payment.amount, 0) / completedPayments.length 
    : 0;

  const conversionRate = totalTransactions > 0 
    ? (successfulTransactions / totalTransactions) * 100 
    : 0;

  // Time-based calculations
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const revenueThisMonth = completedPayments
    .filter(p => new Date(p.createdAt) >= thisMonth)
    .reduce((sum, payment) => sum + payment.netAmount, 0);

  const revenueLastMonth = completedPayments
    .filter(p => {
      const date = new Date(p.createdAt);
      return date >= lastMonth && date <= endOfLastMonth;
    })
    .reduce((sum, payment) => sum + payment.netAmount, 0);

  const revenueGrowth = revenueLastMonth > 0 
    ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
    : 0;

  const transactionsToday = payments.filter(p => 
    new Date(p.createdAt) >= today
  ).length;

  const transactionsThisWeek = payments.filter(p => 
    new Date(p.createdAt) >= thisWeek
  ).length;

  const transactionsThisMonth = payments.filter(p => 
    new Date(p.createdAt) >= thisMonth
  ).length;

  // Top payment method
  const methodCounts = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMethodEntry = Object.entries(methodCounts).reduce((max, [method, count]) => 
    count > max[1] ? [method, count] : max, ['', 0]);

  const topPaymentMethod = {
    method: getPaymentMethodName(topMethodEntry[0]),
    count: topMethodEntry[1],
    percentage: totalTransactions > 0 ? (topMethodEntry[1] / totalTransactions) * 100 : 0,
  };

  // Highest transaction
  const highestTransaction = completedPayments.reduce((max, payment) => 
    payment.amount > max.amount ? payment : max,
    completedPayments[0] || { id: '', amount: 0, customer: { name: '' } }
  );

  return {
    totalRevenue,
    totalTransactions,
    successfulTransactions,
    failedTransactions,
    pendingTransactions,
    refundedTransactions,
    averageTransactionValue,
    totalRefunds,
    conversionRate,
    revenueThisMonth,
    revenueLastMonth,
    revenueGrowth,
    transactionsToday,
    transactionsThisWeek,
    transactionsThisMonth,
    topPaymentMethod,
    highestTransaction: {
      id: highestTransaction.id,
      amount: highestTransaction.amount,
      customer: highestTransaction.customer.name,
    },
  };
};

/**
 * Get unique payment methods from payments
 */
export const getUniquePaymentMethods = (payments: PaymentData[]): string[] => {
  const methods = payments.map(payment => getPaymentMethodName(payment.method));
  return Array.from(new Set(methods));
};

/**
 * Get unique gateways from payments
 */
export const getUniqueGateways = (payments: PaymentData[]): string[] => {
  const gateways = payments.map(payment => payment.gateway);
  return Array.from(new Set(gateways));
};

/**
 * Format large numbers with abbreviations
 */
export const formatLargeNumber = (num: number): string => {
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate growth percentage
 */
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get growth indicator
 */
export const getGrowthIndicator = (growth: number): 'up' | 'down' | 'neutral' => {
  if (growth > 0) return 'up';
  if (growth < 0) return 'down';
  return 'neutral';
};