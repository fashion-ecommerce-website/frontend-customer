/**
 * Environment Configuration
 */

// JWT Configuration - hardcoded
export const JWT_CONFIG = {
  STORAGE_KEY: 'accessToken',
  HEADER_PREFIX: 'Bearer '
};

// Database URLs (for reference only) - hardcoded
export const DATABASE_CONFIG = {
  DEV: 'jdbc:postgresql://localhost:5432/fit_backend_dev',
  PROD: 'jdbc:postgresql://localhost:5432/fit_backend_prod'
};

/**
 * Get API URL from environment variable
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

/**
 * API Endpoints that match Spring Boot backend
 */
export const API_ENDPOINTS = {
  // Public endpoints (no auth required)
  PUBLIC: {
    HEALTH: '/public/health',
    INFO: '/public/info'
  },
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    ADMIN: '/auth/admin',
    USER: '/auth/user'
  },
  
  // Admin endpoints (ADMIN role required)
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    ENABLE_USER: (id: string) => `/admin/users/${id}/enable`,
    DISABLE_USER: (id: string) => `/admin/users/${id}/disable`
  }
};
