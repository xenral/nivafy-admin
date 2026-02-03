/**
 * Application configuration
 * Centralized configuration for all microservices and app settings
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Nivafy Admin Panel',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  api: {
    account: process.env.NEXT_PUBLIC_ACCOUNT_API_URL || 'http://localhost:3001',
    chat: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3001',
    file: process.env.NEXT_PUBLIC_FILE_API_URL || 'http://localhost:3006',
    notification: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || 'http://localhost:3003',
    search: process.env.NEXT_PUBLIC_SEARCH_API_URL || 'http://localhost:3004',
    wallet: process.env.NEXT_PUBLIC_WALLET_API_URL || 'http://localhost:3005',
  },
  auth: {
    tokenKey: 'nivafy_admin_token',
    userKey: 'nivafy_admin_user',
  },
} as const;

export type ServiceName = keyof typeof config.api;

export const getServiceUrl = (service: ServiceName): string => {
  return config.api[service];
};
