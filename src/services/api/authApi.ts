import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { LoginRequest, LoginResponse, User, RefreshTokenRequest, RefreshTokenResponse } from '../../features/auth/login/types/login.types';
import { RegisterRequest, RegisterResponse } from '../../features/auth/register/types/register.types';
import { API_ENDPOINTS } from '../../config/environment';

// Firebase imports for Google Auth
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

// Google Auth Types
export interface GoogleLoginRequest {
  idToken: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleAuthResponse {
  user: BackendUser;
  jwtToken: string;
  message?: string;
}

// Firebase Google Auth Functions
export const googleAuth = {
  // Firebase Google Login with faster popup detection
  signInWithGoogle: async () => {
    try {
      console.log('🚀 Opening Google popup...');
      const startTime = Date.now();
      
      // Monitor window focus to detect popup interactions
      let focusCheckInterval: NodeJS.Timeout | null = null;
      
      // Start monitoring for popup close after 2 seconds
      setTimeout(() => {
        focusCheckInterval = setInterval(() => {
          // If window regains focus and enough time has passed, user might have closed popup
          if (document.hasFocus() && Date.now() - startTime > 3000) {
            if (focusCheckInterval) clearInterval(focusCheckInterval);
          }
        }, 1000);
      }, 2000);
      
      try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // Clean up monitoring
        if (focusCheckInterval) clearInterval(focusCheckInterval);
        
        console.log('✅ Google popup completed successfully');
        
        // Get Firebase ID token for backend verification
        const idToken = await result.user.getIdToken();
        
        return {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          idToken, // Add Firebase token for backend
        };
      } catch (error: unknown) {
        // Clean up monitoring
        if (focusCheckInterval) clearInterval(focusCheckInterval);
        throw error;
      }
      
    } catch (error: unknown) {
      console.log('❌ Google popup error:', error);
      
      const firebaseError = error as { code?: string; message?: string };
      
      // Handle specific Firebase auth errors with faster response
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('Bạn đã đóng cửa sổ đăng nhập');
      } else if (firebaseError.code === 'auth/popup-blocked') {
        throw new Error('Popup bị chặn. Vui lòng cho phép popup và thử lại');
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        throw new Error('Yêu cầu đăng nhập bị hủy');
      } else if (firebaseError.code === 'auth/network-request-failed') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet');
      } else if (firebaseError.code === 'auth/internal-error') {
        throw new Error('Lỗi hệ thống. Vui lòng thử lại');
      }
      throw new Error(firebaseError.message || 'Đăng nhập Google thất bại');
    }
  },

  // Firebase Google Logout
  signOutFromGoogle: async () => {
    await signOut(auth);
  },
};

// Use endpoints from environment config
const AUTH_ENDPOINTS = API_ENDPOINTS.AUTH;
const ADMIN_ENDPOINTS = API_ENDPOINTS.ADMIN;
const PUBLIC_ENDPOINTS = API_ENDPOINTS.PUBLIC;

// Auth API service
export class AuthApiService {
  /**
   * Google Login - Send Firebase token to backend
   */
  async googleLogin(request: GoogleLoginRequest): Promise<GoogleAuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Complete Google Authentication Flow
   */
  async authenticateWithGoogle(): Promise<BackendUser> {
    try {
      // Step 1: Firebase authentication
      console.log('🔥 Starting Firebase authentication...');
      const firebaseUser = await googleAuth.signInWithGoogle();
      console.log('✅ Firebase login successful:', firebaseUser.displayName);
      
      // Step 2: Send to backend
      console.log('📡 Sending token to backend...');
      const backendResponse = await this.googleLogin({
        idToken: firebaseUser.idToken,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL,
      });
      
      // Step 3: Save tokens
      if (backendResponse.jwtToken) {
        localStorage.setItem('token', backendResponse.jwtToken);
        localStorage.setItem('user', JSON.stringify(backendResponse.user));
        console.log('✅ Backend authentication successful:', backendResponse.user);
      }
      
      return backendResponse.user;
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập Google thất bại';
      console.error('❌ Google authentication failed:', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout from both Firebase and Backend
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      // Logout from backend
      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.warn('⚠️  Backend logout failed, continuing with local cleanup');
        }
      }
      
      // Logout from Firebase
      await googleAuth.signOutFromGoogle();
      
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Logout complete');
    }
  }

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
  // Google Authentication
  googleLogin: (request: GoogleLoginRequest) => authApiService.googleLogin(request),
  authenticateWithGoogle: () => authApiService.authenticateWithGoogle(),
  logout: () => authApiService.logout(),
  
  // Traditional Authentication
  login: (credentials: LoginRequest) => authApiService.login(credentials),
  register: (userData: RegisterRequest) => authApiService.register(userData),
  refreshToken: (refreshTokenData: RefreshTokenRequest) => authApiService.refreshToken(refreshTokenData),
  getCurrentUser: () => authApiService.getCurrentUser(),
  
  // Admin & User endpoints
  getAdminData: () => authApiService.getAdminData(),
  getUserData: () => authApiService.getUserData(),
  getAllUsers: () => authApiService.getAllUsers(),
  getUserById: (id: string) => authApiService.getUserById(id),
  enableUser: (id: string) => authApiService.enableUser(id),
  disableUser: (id: string) => authApiService.disableUser(id),
  
  // Health checks
  getHealth: () => authApiService.getHealth(),
  getInfo: () => authApiService.getInfo(),
};
