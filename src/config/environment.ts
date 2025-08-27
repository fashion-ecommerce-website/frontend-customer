/**
 * Environment Configuration
 * Configuration for different environments to match Spring Boot backend
 */

export const ENV_CONFIG = {
  // API Base URLs
  API: {
    DEV: 'http://localhost:8080/api',
    PROD: process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com/api',
    LOCAL: 'http://localhost:8080/api'
  },
  
  // JWT Configuration
  JWT: {
    STORAGE_KEY: 'accessToken',
    HEADER_PREFIX: 'Bearer '
  },
  
  // Spring Boot Database URLs (for reference)
  DATABASE: {
    DEV: 'jdbc:postgresql://localhost:5432/fit_backend_dev',
    PROD: 'jdbc:postgresql://localhost:5432/fit_backend_prod'
  },
  
  // PgAdmin URL
  PGADMIN_URL: 'http://localhost:8081'
};

/**
 * Get current API URL based on environment
 */
export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return ENV_CONFIG.API.PROD;
  }
  
  // Check if custom API URL is set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return ENV_CONFIG.API.DEV;
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

export default ENV_CONFIG;
