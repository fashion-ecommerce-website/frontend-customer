import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { LoginRequest, LoginResponse, User, RefreshTokenRequest, RefreshTokenResponse } from '../../features/auth/login/types/login.types';
import { RegisterRequest, RegisterResponse } from '../../features/auth/register/types/register.types';
import { API_ENDPOINTS } from '../../config/environment';

// Use endpoints from environment config
const AUTH_ENDPOINTS = API_ENDPOINTS.AUTH;
const ADMIN_ENDPOINTS = API_ENDPOINTS.ADMIN;
const PUBLIC_ENDPOINTS = API_ENDPOINTS.PUBLIC;

// Auth API service
export class AuthApiService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, userData);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    return apiClient.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, refreshTokenData);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(AUTH_ENDPOINTS.ME);
  }

  /**
   * Admin endpoint - test admin access
   */
  async getAdminData(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<Record<string, unknown>>(AUTH_ENDPOINTS.ADMIN);
  }

  /**
   * User endpoint - test user access
   */
  async getUserData(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<Record<string, unknown>>(AUTH_ENDPOINTS.USER);
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(ADMIN_ENDPOINTS.USERS);
  }

  /**
   * Get user by ID (Admin only)
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(ADMIN_ENDPOINTS.USER_BY_ID(id));
  }

  /**
   * Enable user (Admin only)
   */
  async enableUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.put<User>(ADMIN_ENDPOINTS.ENABLE_USER(id));
  }

  /**
   * Disable user (Admin only)
   */
  async disableUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.put<User>(ADMIN_ENDPOINTS.DISABLE_USER(id));
  }

  /**
   * Check application health
   */
  async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return apiClient.get<{ status: string; timestamp: string }>(PUBLIC_ENDPOINTS.HEALTH);
  }

  /**
   * Get application info
   */
  async getInfo(): Promise<ApiResponse<{ version: string; name: string }>> {
    return apiClient.get<{ version: string; name: string }>(PUBLIC_ENDPOINTS.INFO);
  }
}

// Export singleton instance
export const authApiService = new AuthApiService();

// Export API functions for saga factories
export const authApi = {
  login: (credentials: LoginRequest) => authApiService.login(credentials),
  register: (userData: RegisterRequest) => authApiService.register(userData),
  refreshToken: (refreshTokenData: RefreshTokenRequest) => authApiService.refreshToken(refreshTokenData),
  getCurrentUser: () => authApiService.getCurrentUser(),
  getAdminData: () => authApiService.getAdminData(),
  getUserData: () => authApiService.getUserData(),
  getAllUsers: () => authApiService.getAllUsers(),
  getUserById: (id: string) => authApiService.getUserById(id),
  enableUser: (id: string) => authApiService.enableUser(id),
  disableUser: (id: string) => authApiService.disableUser(id),
  getHealth: () => authApiService.getHealth(),
  getInfo: () => authApiService.getInfo(),
};
