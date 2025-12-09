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
 * NOTE: These values should match Backend GHNCarrierService defaults
 */
export const GHN_CONFIG = {
  API_URL: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
  TOKEN: process.env.NEXT_PUBLIC_GHN_TOKEN,
  SHOP_ID: process.env.NEXT_PUBLIC_GHN_SHOP_ID,
  FROM_DISTRICT_ID: process.env.NEXT_PUBLIC_GHN_FROM_DISTRICT_ID,
  PRODUCT_TOKEN: process.env.NEXT_PUBLIC_GHN_PRODUCT_TOKEN,
  // Default package dimensions (in cm and grams)
  // Must match Backend GHNCarrierService defaults for consistent pricing
  DEFAULT_PACKAGE: {
    height: 10,      // cm - matches Backend default
    length: 10,      // cm - matches Backend default
    width: 10,       // cm - matches Backend default
    weight: 200,     // grams - Backend uses 200g per item
    insurance_value: 0
  },
  // Weight per item in grams (Backend uses 200g per item)
  WEIGHT_PER_ITEM: 200,
};

/**
 * Fitroom Virtual Try-On Configuration
 */
export const FITROOM_CONFIG = {
  API_BASE_URL: 'https://platform.fitroom.app/api/tryon/v2',
  API_KEY: process.env.NEXT_PUBLIC_FITROOM_API_KEY || '49a5992a71d84d1ea6deea13ee633d874db21fa98f13682b84ac9b87b135a5c3',
  STATUS_API_KEY: process.env.NEXT_PUBLIC_FITROOM_STATUS_API_KEY || '38f436e1fb294a5bb62268350044db75f3f14b5003b4c21d434a14fa6b1184ba',
  // Default cloth type for virtual try-on
  DEFAULT_CLOTH_TYPE: 'upper' as const,
  // Polling configuration
  POLLING: {
    MAX_ATTEMPTS: 60,        // Maximum number of polling attempts
    INTERVAL_MS: 2000,       // Interval between polls in milliseconds
    TIMEOUT_MS: 120000,      // Overall timeout in milliseconds (2 minutes)
  }
};