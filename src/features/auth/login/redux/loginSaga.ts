/**
 * Login Redux Saga
 * Self-contained saga logic for login feature
 */

import { fork, call, put } from 'redux-saga/effects';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { takeEvery } = require('redux-saga/effects');
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
  logoutRequest,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  setLoading 
} from './loginSlice';
import { clearCart } from '../../../cart/redux/cartSlice';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, User } from '../types/login.types';

// API Response interface
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

import { authApi, type BackendUser } from '../../../../services/api/authApi';
import { profileApiService, ApiUserResponse } from '../../../../services/api/profileApi';
import { setUser } from './loginSlice';

// Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY
function convertDateFromApi(dateString: string): string {
  if (!dateString) return '';
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes('/')) return dateString;
  
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateString;
}

// Helper function to convert ApiUserResponse to User
function convertApiUserToUser(apiUser: ApiUserResponse) {
  return {
    id: apiUser.id.toString(),
    email: apiUser.email,
    username: apiUser.username,
    firstName: '', // API doesn't have firstName/lastName, will be empty
    lastName: '',
    phone: apiUser.phone,
    avatar: apiUser.avatarUrl || undefined,
    dob: convertDateFromApi(apiUser.dob), // Convert YYYY-MM-DD to DD/MM/YYYY
    role: 'USER' as const,
    enabled: apiUser.active,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    avatarUrl: apiUser.avatarUrl,
    reason: apiUser.reason,
    lastLoginAt: apiUser.lastLoginAt,
    emailVerified: apiUser.emailVerified,
    phoneVerified: apiUser.phoneVerified,
    roles: apiUser.roles,
    active: apiUser.active,
  };
}

// Helper function to convert BackendUser to User for Google login
function convertBackendUserToUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    username: backendUser.email, // Use email as username since backend doesn't provide username
    firstName: '', // Backend only provides 'name', no firstName/lastName split
    lastName: '',
    phone: undefined, // BackendUser doesn't include phone
    avatar: backendUser.picture,
    role: 'USER' as const,
    enabled: true, // Assume enabled for Google users
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
    // Google-specific fields
    name: backendUser.name,
    picture: backendUser.picture,
    provider: backendUser.provider as 'EMAIL' | 'GOOGLE',
    // Default values for missing fields
    dob: undefined,
    gender: undefined,
    avatarUrl: backendUser.picture,
    reason: null,
    lastLoginAt: undefined,
    emailVerified: true, // Assume Google users have verified emails
    phoneVerified: false,
    roles: ['USER'],
    active: true,
    isEmailVerified: true,
  };
}

// Login saga with token storage and profile loading
function* handleLogin(action: PayloadAction<LoginRequest>) {
  try {
    yield put(setLoading(true));
    
    const response: ApiResponse<LoginResponse> = yield call(() => authApi.login(action.payload));
    if (response.success && response.data.accessToken) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      // Store basic user data from login response
      const basicUserData = {
        id: '', // Will be filled when we fetch user profile
        username: response.data.username,
        email: response.data.email,
        firstName: '',
        lastName: '',
        role: 'USER' as const,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(basicUserData));
      
      // First, set login success with basic data
      yield put(loginSuccess(response.data));
      
      // Then immediately fetch full profile data
      try {
        const profileResponse: ApiResponse<ApiUserResponse> = yield call(() => profileApiService.getProfile());
        
        if (profileResponse.success && profileResponse.data) {
          const fullUserData = convertApiUserToUser(profileResponse.data);
          // Update localStorage with full user data
          localStorage.setItem('user', JSON.stringify(fullUserData));
          // Update Redux store with full user data
          yield put(setUser(fullUserData));
        }
        // If profile fetch fails, we still keep the login successful with basic data
      } catch (profileError) {
        // Log error but don't fail the login process
        console.warn('Failed to fetch profile after login:', profileError);
      }
    } else {
      yield put(loginFailure({
        message: response.message || 'Login failed',
        status: 401
      }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as Error & { status: number }).status : 500;
    const errorCode = error instanceof Error && 'code' in error ? 
      (error as Error & { code: string }).code : undefined;
      
    yield put(loginFailure({
      message: errorMessage,
      status: errorStatus,
      code: errorCode
    }));
  } finally {
    yield put(setLoading(false));
  }
}

// Logout saga with token clearing
function* handleLogout() {
  try {
    // Just clear local storage - no API call needed for logout
    
    // Clear tokens regardless of API response
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cart data when user logs out
    yield put(clearCart());
    
    yield put(logoutSuccess());
  } catch (_error: unknown) {
    // Clear tokens even on error
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cart data even on error
    yield put(clearCart());
    
    // Still dispatch success since logout should always succeed locally
    yield put(logoutSuccess());
  }
}

// Refresh Token saga
function* handleRefreshToken(action: PayloadAction<RefreshTokenRequest>) {
  try {
    yield put(setLoading(true));
    
    const response: ApiResponse<RefreshTokenResponse> = yield call(() => authApi.refreshToken(action.payload));
    
    if (response.success && response.data.accessToken) {
      // Store new tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      yield put(refreshTokenSuccess({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
        username: response.data.username,
        email: response.data.email,
      }));
    } else {
      yield put(refreshTokenFailure({
        message: response.message || 'Token refresh failed',
        status: 401
      }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as Error & { status: number }).status : 500;
    const errorCode = error instanceof Error && 'code' in error ? 
      (error as Error & { code: string }).code : undefined;
      
    yield put(refreshTokenFailure({
      message: errorMessage,
      status: errorStatus,
      code: errorCode
    }));
  } finally {
    yield put(setLoading(false));
  }
}

// Google Login saga
function* handleGoogleLogin() {
  try {
    // Call Google authentication service
    const backendUser: BackendUser = yield call(() => authApi.authenticateWithGoogle());
    
    // Convert BackendUser to User format
    const convertedUser = convertBackendUserToUser(backendUser);
    
    // Get token from localStorage (authApi now saves it as 'accessToken')
    const token = localStorage.getItem('accessToken');
    
    // Update localStorage with converted user data for consistency
    localStorage.setItem('user', JSON.stringify(convertedUser));
    
    const googleResponse = {
      user: convertedUser, // Use converted user instead of backendUser
      jwtToken: token || '',
    };
    
    yield put(googleLoginSuccess(googleResponse));
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Google login failed';
    
    // Don't show error for user cancellation cases
    const isCancelledByUser = errorMessage.includes('đóng cửa sổ') || 
                             errorMessage.includes('bị hủy') || 
                             errorMessage.includes('cancelled') ||
                             errorMessage.includes('popup-closed-by-user');
    
    // Always dispatch failure to reset google loading state
    yield put(googleLoginFailure({
      message: isCancelledByUser ? 'Google login cancelled by user' : errorMessage,
      status: isCancelledByUser ? 0 : 500
    }));
  } finally {
    // No-op: google loading is managed by googleLoginRequest/success/failure
  }
}

// Watch functions
function* watchLogin() {
  yield takeEvery(loginRequest.type, handleLogin);
}

function* watchLogout() {
  yield takeEvery(logoutRequest.type, handleLogout);
}

function* watchRefreshToken() {
  yield takeEvery(refreshTokenRequest.type, handleRefreshToken);
}

function* watchGoogleLogin() {
  yield takeEvery(googleLoginRequest.type, handleGoogleLogin);
}

// Root login saga
export function* loginSaga() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchRefreshToken);
  yield fork(watchGoogleLogin);
}

// Export individual sagas for testing
export { handleLogin, handleLogout, handleRefreshToken, handleGoogleLogin };
