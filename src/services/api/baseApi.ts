import { ApiResponse } from '../../types/api.types';
import { getApiUrl, JWT_CONFIG } from '../../config/environment';
import { authUtils } from '../../utils/auth';

// Base API configuration
const API_BASE_URL = getApiUrl();

// HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request options
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string | FormData;
}

// Base API class
class BaseApi {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value: string | null) => void;
    reject: (reason: unknown) => void;
  }> = [];

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Process the queue of failed requests
  private processQueue(error: unknown, token?: string) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token ?? null);
      }
    });

    this.failedQueue = [];
  }

  // Refresh token logic
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Validate refresh token format (should be JWT)
      if (!refreshToken.includes('.') || refreshToken.split('.').length !== 3) {
        throw new Error('Invalid refresh token format');
      }
      
      const payload = { refreshToken };

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Đảm bảo không gửi Authorization header cho refresh request
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        
        // Log để debug
        if (response.status === 403) {
          throw new Error('403 Forbidden - RefreshToken có thể đã hết hạn hoặc không hợp lệ');
        }
        
        throw new Error(`Failed to refresh token: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      // Kiểm tra structure của response data
      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;
      
      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Invalid response structure from refresh endpoint');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      this.processQueue(null, newAccessToken);
      return newAccessToken;
    } catch (error) {
      this.processQueue(error, undefined);
      // Clear tokens if refresh fails
      authUtils.clearAuth();
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Get authorization header
  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `${JWT_CONFIG.HEADER_PREFIX}${token}` } : {};
  }

  // Check if token is expired or about to expire
  private isTokenExpired(): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return true;

    try {
      // Decode JWT token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      
      // Consider token expired if it expires within next 30 seconds
      const isExpired = exp - now < 30;
      return isExpired;
    } catch (error) {
      return true;
    }
  }

  // Proactive token refresh before making request
  private async ensureValidToken(): Promise<boolean> {
    if (this.isTokenExpired()) {
      const newToken = await this.refreshToken();
      return newToken !== null;
    }
    return true;
  }

  // Make HTTP request
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions,
    retry: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      // Chỉ kiểm tra token với các endpoint thực sự cần đăng nhập
      // Không kiểm tra với GET /products hoặc các API public
      const isGetProducts = options.method === 'GET' && endpoint.startsWith('/products');
      if (!endpoint.includes('/auth/') && !endpoint.includes('/public/') && !isGetProducts) {
        const tokenValid = await this.ensureValidToken();
        if (!tokenValid) {
          return {
            success: false,
            data: null,
            message: 'Authentication required',
          };
        }
      }

      const url = `${this.baseUrl}${endpoint}`;
      const authHeaders = this.getAuthHeaders();
      const headers = {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      };

      const config: RequestInit = {
        method: options.method,
        headers,
      };

      if (options.body && options.method !== 'GET') {
        config.body = options.body;
      }

      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retry && !endpoint.includes('/auth/refresh')) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry the request with new token
          return this.makeRequest<T>(endpoint, options, false);
        } else {
          return {
            success: false,
            data: null,
            message: 'Authentication failed',
          };
        }
      }

      // Check if response has content before parsing JSON
      let data: any = null;
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Only parse JSON if there's content
      if (contentLength !== '0' && contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          if (text.trim()) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          // If JSON parsing fails, it's not a JSON response
          data = null;
        }
      }

      if (!response.ok) {
        return {
          success: false,
          data: null,
          message: data?.message || `HTTP Error: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data,
        message: data?.message,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    body?: Record<string, unknown> | unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined, 
      headers 
    });
  }

  async put<T>(
    endpoint: string,
    body?: Record<string, unknown> | unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined, 
      headers 
    });
  }

  async patch<T>(
    endpoint: string,
    body?: Record<string, unknown> | unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { 
      method: 'PATCH', 
      body: body ? JSON.stringify(body) : undefined, 
      headers 
    });
  }

  async delete<T>(
    endpoint: string,
    body?: Record<string, unknown> | unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }
}

// Export singleton instance
export const apiClient = new BaseApi();
export default BaseApi;
