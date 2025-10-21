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
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    USER: '/auth/user'
  },

  // Product endpoints
  PRODUCT: {
    LIST: '/products',
    DETAIL: '/products/details/', // GET /products/{id}
    COLOR: '/products/details', // GET /products/details/{id}/color?activeColor={color}
  },

  // Cart endpoints
  CART: {
    LIST: '/cart',
    ADD: '/cart',
    UPDATE: '/cart', // PUT /cart/{id}
    REMOVE: '/cart', // DELETE /cart/{id}
    CLEAR: '/cart'
  }
};

/**
 * GHN (Giao Hàng Nhanh) Configuration
 */
export const GHN_CONFIG = {
  API_URL: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
  TOKEN: process.env.NEXT_PUBLIC_GHN_TOKEN,
  SHOP_ID: process.env.NEXT_PUBLIC_GHN_SHOP_ID,
  FROM_DISTRICT_ID: process.env.NEXT_PUBLIC_GHN_FROM_DISTRICT_ID,
  PRODUCT_TOKEN: process.env.NEXT_PUBLIC_GHN_PRODUCT_TOKEN,
  // Default package dimensions (in cm and grams)
  DEFAULT_PACKAGE: {
    height: 20,
    length: 30,
    width: 40,
    weight: 3000, // 3kg in grams
    insurance_value: 0
  }
};