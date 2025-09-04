/**
 * Environment Configuration
 */

// JWT Configuration
export const JWT_CONFIG = {
  STORAGE_KEY: 'accessToken',
  HEADER_PREFIX: 'Bearer '
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
    USER: '/auth/user'
  }
};
