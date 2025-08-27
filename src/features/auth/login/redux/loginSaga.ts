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
  logoutRequest,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  setLoading 
} from './loginSlice';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../types/login.types';

// API Response interface
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

import { authApi } from '../../../../services/api/authApi';
// Login saga with token storage
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
      
      // Store user data
      const userData = {
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
      localStorage.setItem('user', JSON.stringify(userData));
      
      yield put(loginSuccess(response.data));
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
    
    yield put(logoutSuccess());
  } catch (_error: unknown) {
    // Clear tokens even on error
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
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

// Root login saga
export function* loginSaga() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchRefreshToken);
}

// Export individual sagas for testing
export { handleLogin, handleLogout, handleRefreshToken };
