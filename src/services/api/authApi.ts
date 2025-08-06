import { apiClient } from './baseApi';
import { ApiResponse } from '@/redux/auth/factories';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthResponse, User } from '@/redux/auth';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
} as const;

// Auth API service
export class AuthApiService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT);
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(data: { token: string }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    return apiClient.post<{ accessToken: string; expiresIn: number }>(AUTH_ENDPOINTS.REFRESH_TOKEN);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(AUTH_ENDPOINTS.ME);
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();

// Export API functions for saga factories
export const authApi = {
  login: (credentials: LoginRequest) => authApiService.login(credentials),
  register: (userData: RegisterRequest) => authApiService.register(userData),
  logout: () => authApiService.logout(),
  forgotPassword: (data: ForgotPasswordRequest) => authApiService.forgotPassword(data),
  resetPassword: (data: ResetPasswordRequest) => authApiService.resetPassword(data),
  verifyEmail: (data: { token: string }) => authApiService.verifyEmail(data),
  refreshToken: () => authApiService.refreshToken(),
  getCurrentUser: () => authApiService.getCurrentUser(),
};
