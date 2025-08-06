/**
 * Login Redux Saga
 * Self-contained saga logic for login feature
 */

import { all, fork, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setLoading 
} from './loginSlice';
import { LoginRequest, LoginResponse, ApiError } from '../types/login.types';

// API Response interface
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Mock API calls (replace with actual API service)
const loginApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          avatar: null,
          role: 'customer' as const,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      },
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: undefined };
  },
};

// Login saga with token storage
function* handleLogin(action: PayloadAction<LoginRequest>) {
  try {
    yield put(setLoading(true));
    
    const response: ApiResponse<LoginResponse> = yield call(loginApi.login, action.payload);
    
    if (response.success) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      yield put(loginSuccess(response.data));
    } else {
      yield put(loginFailure({
        message: response.message || 'Login failed',
        status: 401
      }));
    }
  } catch (error: any) {
    yield put(loginFailure({
      message: error.message || 'Network error occurred',
      status: error.status || 500,
      code: error.code
    }));
  } finally {
    yield put(setLoading(false));
  }
}

// Logout saga with token clearing
function* handleLogout() {
  try {
    yield call(loginApi.logout);
    
    // Clear tokens regardless of API response
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    yield put(logoutSuccess());
  } catch (error: any) {
    // Clear tokens even on error
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Still dispatch success since logout should always succeed locally
    yield put(logoutSuccess());
  }
}

// Watch functions
function* watchLogin() {
  yield takeLatest(loginRequest.type, handleLogin);
}

function* watchLogout() {
  yield takeLatest(logoutRequest.type, handleLogout);
}

// Root login saga
export function* loginSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
  ]);
}

// Export individual sagas for testing
export { handleLogin, handleLogout };
