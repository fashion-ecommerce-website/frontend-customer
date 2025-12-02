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

export interface FirebaseGoogleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  idToken: string;
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
  // Firebase Google Login with fast popup close detection
  signInWithGoogle: async (): Promise<FirebaseGoogleUser> => {
    return new Promise((resolve, reject) => {
      console.log('🚀 Opening Google popup...');
      
      let isResolved = false;
      let focusCheckInterval: NodeJS.Timeout | null = null;
      let windowBlurTimer: NodeJS.Timeout | null = null;
      
      const cleanup = () => {
        if (focusCheckInterval) {
          clearInterval(focusCheckInterval);
          focusCheckInterval = null;
        }
        if (windowBlurTimer) {
          clearTimeout(windowBlurTimer);
          windowBlurTimer = null;
        }
      };
      
      const handlePopupClosed = () => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(new Error('Bạn đã đóng cửa sổ đăng nhập'));
        }
      };
      
      // Monitor window focus changes to detect popup close
      const onWindowFocus = () => {
        if (windowBlurTimer) {
          clearTimeout(windowBlurTimer);
          windowBlurTimer = setTimeout(() => {
            // If we regain focus after being blurred, popup might be closed
            if (!isResolved) {
              handlePopupClosed();
            }
          }, 300); // Reduced delay for faster popup close detection
        }
      };
      
      const onWindowBlur = () => {
        // Clear any existing timer when window loses focus
        if (windowBlurTimer) {
          clearTimeout(windowBlurTimer);
          windowBlurTimer = null;
        }
      };
      
      // Start monitoring focus changes after popup should be open
      setTimeout(() => {
        if (!isResolved) {
          window.addEventListener('focus', onWindowFocus);
          window.addEventListener('blur', onWindowBlur);
          
          // Also check periodically if window has focus (popup might be closed)
          focusCheckInterval = setInterval(() => {
            if (document.hasFocus() && !isResolved) {
              // Window has focus, popup might be closed
              setTimeout(() => {
                if (!isResolved) {
                  handlePopupClosed();
                }
              }, 200); // Reduced delay for faster response
            }
          }, 500); // Check more frequently
        }
      }, 500); // Start monitoring sooner
      
      // Call Firebase signInWithPopup
      signInWithPopup(auth, googleProvider)
        .then(async (result) => {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            window.removeEventListener('focus', onWindowFocus);
            window.removeEventListener('blur', onWindowBlur);
            
            console.log('✅ Google popup completed successfully');
            
            // Get Firebase ID token for backend verification
            const idToken = await result.user.getIdToken();
            
            resolve({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              idToken, // Add Firebase token for backend
            });
          }
        })
        .catch((error: unknown) => {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            window.removeEventListener('focus', onWindowFocus);
            window.removeEventListener('blur', onWindowBlur);
            
            console.log('❌ Google popup error:', error);
            
            const firebaseError = error as { code?: string; message?: string };
            
            // Handle specific Firebase auth errors with immediate response
            if (firebaseError.code === 'auth/popup-closed-by-user') {
              reject(new Error('Bạn đã đóng cửa sổ đăng nhập'));
            } else if (firebaseError.code === 'auth/popup-blocked') {
              reject(new Error('Popup bị chặn. Vui lòng cho phép popup và thử lại'));
            } else if (firebaseError.code === 'auth/cancelled-popup-request') {
              reject(new Error('Yêu cầu đăng nhập bị hủy'));
            } else if (firebaseError.code === 'auth/network-request-failed') {
              reject(new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet'));
            } else if (firebaseError.code === 'auth/internal-error') {
              reject(new Error('Lỗi hệ thống. Vui lòng thử lại'));
            } else {
              reject(new Error(firebaseError.message || 'Đăng nhập Google thất bại'));
            }
          }
        });
    });
  },

  // Firebase Google Logout
  signOutFromGoogle: async () => {
    await signOut(auth);
  },
};

// Use endpoints from environment config
const AUTH_ENDPOINTS = API_ENDPOINTS.AUTH;
const PUBLIC_ENDPOINTS = API_ENDPOINTS.PUBLIC;

// Auth API service
export class AuthApiService {
  /**
   * Google Login - Send Firebase token to backend
   */
  async googleLogin(request: GoogleLoginRequest): Promise<GoogleAuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
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
      const firebaseUser = await googleAuth.signInWithGoogle();
      
      // ✅ Firebase authentication successful - show full token for testing
      console.log('✅ Firebase authentication successful:');
      console.log('🔑 Full ID Token:', firebaseUser.idToken);
      console.log('📤 Sending to backend API with data:', {
        idToken: firebaseUser.idToken,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL,
      });
      
      // Step 2: Send to backend
      const backendResponse = await this.googleLogin({
        idToken: firebaseUser.idToken,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL,
      });
      
      // ✅ Backend response received
      console.log('✅ Backend authentication successful:', backendResponse);

      // Step 3: Handle token-only login response 
      if ((backendResponse as { accessToken?: string })?.accessToken) {
        const tokenResp = backendResponse as unknown as {
          accessToken: string;
          refreshToken?: string;
          username?: string;
          email?: string;
          expiresIn?: number;
        };
        localStorage.setItem('accessToken', tokenResp.accessToken);
        if (tokenResp.refreshToken) {
          localStorage.setItem('refreshToken', tokenResp.refreshToken);
        }

        const normalizedUser: BackendUser = {
          id: firebaseUser.uid,
          email: tokenResp.email || firebaseUser.email || '',
          name: tokenResp.username || firebaseUser.displayName || (firebaseUser.email || '').split('@')[0] || '',
          picture: firebaseUser.photoURL || undefined,
          provider: 'GOOGLE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        console.log('💾 Saved token-only response and constructed user from Firebase');
        console.log('✅ Google authentication flow completed successfully');
        return normalizedUser;
      }

      // Fallback: unexpected response shape
      throw new Error('Phản hồi xác thực không hợp lệ từ máy chủ');
      
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
   * User endpoint - test user access
   */
  async getUserData(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get<Record<string, unknown>>(AUTH_ENDPOINTS.USER);
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

  /**
   * Verify OTP code
   */
  async verifyOtp(request: { email: string; otpCode: string }): Promise<ApiResponse<null>> {
    return apiClient.post<null>(AUTH_ENDPOINTS.VERIFY_OTP, request);
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
  verifyOtp: (request: { email: string; otpCode: string }) => authApiService.verifyOtp(request),
  refreshToken: (refreshTokenData: RefreshTokenRequest) => authApiService.refreshToken(refreshTokenData),
  getCurrentUser: () => authApiService.getCurrentUser(),
  
  // User endpoints
  getUserData: () => authApiService.getUserData(),
  
  // Health checks
  getHealth: () => authApiService.getHealth(),
  getInfo: () => authApiService.getInfo(),
};
