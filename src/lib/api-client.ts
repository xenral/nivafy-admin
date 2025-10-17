/**
 * API Client with axios interceptors
 * Handles authentication, error handling, token refresh, and request/response transformation
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config, ServiceName } from './config';
import { ErrorResponse } from '@/types/nivafy';

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create axios instances for each service
const createServiceClient = (serviceUrl: string): AxiosInstance => {
  const client = axios.create({
    baseURL: serviceUrl + '/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (Zustand persisted state)
      const authData = localStorage.getItem('litepanel-auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          const token = parsed.state?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Failed to parse auth data:', error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 - Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't retry refresh endpoint itself
        if (originalRequest.url?.includes('/auth/refresh')) {
          console.error('🔴 Refresh token failed, logging out');
          // Clear auth state
          localStorage.removeItem('litepanel-auth-storage');
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Queue the request while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Try to refresh token
        try {
          const authData = localStorage.getItem('litepanel-auth-storage');
          if (!authData) {
            throw new Error('No auth data found');
          }

          const parsed = JSON.parse(authData);
          const refreshToken = parsed.state?.refreshToken;

          if (!refreshToken) {
            throw new Error('No refresh token found');
          }

          console.log('🔄 Refreshing access token...');

          // Call refresh endpoint
          const response = await axios.post(
            `${config.api.account}/api/v1/auth/refresh`,
            { refreshToken }
          );

          const newAccessToken = response.data.accessToken;

          console.log('✅ Token refreshed successfully');

          // Update token in localStorage
          parsed.state.token = newAccessToken;
          localStorage.setItem('litepanel-auth-storage', JSON.stringify(parsed));

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process queued requests
          processQueue(null, newAccessToken);

          // Retry original request
          return client(originalRequest);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          processQueue(refreshError, null);

          // Clear auth state
          localStorage.removeItem('litepanel-auth-storage');

          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle 403 - Forbidden
      if (error.response?.status === 403) {
        console.error('Insufficient permissions');
      }

      // Format error response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unknown error occurred';

      return Promise.reject({
        message: errorMessage,
        statusCode: error.response?.status || 500,
        error: error.response?.data?.error,
      } as ErrorResponse);
    }
  );

  return client;
};

// Create clients for all services
export const apiClients = {
  account: createServiceClient(config.api.account),
  chat: createServiceClient(config.api.chat),
  file: createServiceClient(config.api.file),
  notification: createServiceClient(config.api.notification),
  search: createServiceClient(config.api.search),
  wallet: createServiceClient(config.api.wallet),
};

// Helper to get client for a specific service
export const getApiClient = (service: ServiceName): AxiosInstance => {
  return apiClients[service];
};

// Generic API methods
export const api = {
  get: async <T = any>(service: ServiceName, url: string, params?: any): Promise<T> => {
    const response = await getApiClient(service).get<T>(url, { params });
    return response.data;
  },

  post: async <T = any>(service: ServiceName, url: string, data?: any): Promise<T> => {
    const response = await getApiClient(service).post<T>(url, data);
    return response.data;
  },

  put: async <T = any>(service: ServiceName, url: string, data?: any): Promise<T> => {
    const response = await getApiClient(service).put<T>(url, data);
    return response.data;
  },

  patch: async <T = any>(service: ServiceName, url: string, data?: any): Promise<T> => {
    const response = await getApiClient(service).patch<T>(url, data);
    return response.data;
  },

  delete: async <T = any>(service: ServiceName, url: string): Promise<T> => {
    const response = await getApiClient(service).delete<T>(url);
    return response.data;
  },
};

export default api;
