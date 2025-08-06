/**
 * Login Redux Slice
 * Self-contained Redux logic for login feature
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginState, LoginRequest, LoginResponse, ApiError } from '../types/login.types';

// Initial state
const initialState: LoginState = {
  // User data
  user: null,
  isAuthenticated: false,
  
  // Tokens
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  
  // Loading states
  isLoading: false,
  
  // Error states
  error: null,
  
  // UI states
  lastLoginAt: null,
  rememberMe: false,
};

// Login slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // Login Actions
    loginRequest: (state, action: PayloadAction<LoginRequest>) => {
      state.isLoading = true;
      state.error = null;
      state.rememberMe = action.payload.rememberMe || false;
    },
    
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.lastLoginAt = new Date().toISOString();
      
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + action.payload.expiresIn);
      state.tokenExpiresAt = expiresAt.toISOString();
    },
    
    loginFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    
    // Logout Actions
    logoutRequest: (state) => {
      state.isLoading = true;
    },
    
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastLoginAt = null;
      state.rememberMe = false;
    },
    
    // Utility Actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearState: (state) => {
      Object.assign(state, initialState);
    },
    
    // Token Management
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; expiresIn: number }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + action.payload.expiresIn);
      state.tokenExpiresAt = expiresAt.toISOString();
    },
    
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setLoading,
  clearError,
  clearState,
  setTokens,
  clearTokens,
} = loginSlice.actions;

// Export reducer
export const loginReducer = loginSlice.reducer;

// Action creators for saga
export const loginActionCreators = {
  login: {
    request: loginRequest,
    success: loginSuccess,
    failure: loginFailure,
  },
  logout: {
    request: logoutRequest,
    success: logoutSuccess,
    failure: loginFailure, // Reuse login failure for logout errors
  },
};

// Selectors
export const selectLoginState = (state: { login: LoginState }) => state.login;
export const selectUser = (state: { login: LoginState }) => state.login.user;
export const selectIsAuthenticated = (state: { login: LoginState }) => state.login.isAuthenticated;
export const selectIsLoading = (state: { login: LoginState }) => state.login.isLoading;
export const selectError = (state: { login: LoginState }) => state.login.error;
export const selectAccessToken = (state: { login: LoginState }) => state.login.accessToken;
export const selectRefreshToken = (state: { login: LoginState }) => state.login.refreshToken;

// Export slice
export default loginSlice;
