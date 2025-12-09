import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginState, LoginRequest, LoginResponse, ApiError, User, GoogleUser } from '../types/login.types';
import { RootState } from '../../../../store/rootReducer';

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
  isGoogleLoading: false,
  
  // Error states
  error: null,
  
  // UI states
  lastLoginAt: null,
};

// Login slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // Login Actions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRequest: (state, _action: PayloadAction<LoginRequest>) => {
      state.isLoading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      
      // Create user object from token response
      const user = {
        id: '', // Will be filled when we fetch user profile
        username: action.payload.username,
        email: action.payload.email,
        firstName: '',
        lastName: '',
        role: 'USER' as const,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.user = user;
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
    
    // Google Login Actions
    googleLoginRequest: (state) => {
      state.isGoogleLoading = true;
      state.error = null;
    },
    
    googleLoginSuccess: (state, action: PayloadAction<{user: GoogleUser; jwtToken: string}>) => {
      state.isGoogleLoading = false;
      
      // Create user object from Google response with all needed fields
      const user = {
        id: action.payload.user.id,
        username: action.payload.user.name || action.payload.user.email.split('@')[0],
        email: action.payload.user.email,
        firstName: action.payload.user.name?.split(' ')[0] || '',
        lastName: action.payload.user.name?.split(' ').slice(1).join(' ') || '',
        role: 'USER' as const,
        enabled: true,
        createdAt: action.payload.user.createdAt,
        updatedAt: action.payload.user.updatedAt,
        // Google-specific fields
        name: action.payload.user.name,
        picture: action.payload.user.picture,
        provider: 'GOOGLE' as const,
      };
      
      state.user = user;
      state.accessToken = action.payload.jwtToken;
      state.isAuthenticated = true;
      state.error = null;
      state.lastLoginAt = new Date().toISOString();
    },
    
    googleLoginFailure: (state, action: PayloadAction<ApiError>) => {
      state.isGoogleLoading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    
    // Logout Actions
    logoutRequest: (state) => {
      state.isLoading = true;
    },    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastLoginAt = null;
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
    
    // Profile Update Actions
    updateUserProfile: (state, action: PayloadAction<User>) => {
      // Update the entire user object with new profile data
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
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

    // Refresh Token Actions
    refreshTokenRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    refreshTokenSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; expiresIn: number; username: string; email: string }>) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      
      // Update user info if provided
      if (state.user) {
        state.user.username = action.payload.username;
        state.user.email = action.payload.email;
      }
      
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + action.payload.expiresIn);
      state.tokenExpiresAt = expiresAt.toISOString();
    },

    refreshTokenFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
      // Clear tokens on refresh failure
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Restore auth state from localStorage
    restoreAuthState: (state, action: PayloadAction<{ user: User; accessToken: string; isAuthenticated: boolean }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
  logoutRequest,
  logoutSuccess,
  setLoading,
  clearError,
  clearState,
  setTokens,
  clearTokens,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  restoreAuthState,
  updateUserProfile,
  setUser,
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
  refreshToken: {
    request: refreshTokenRequest,
    success: refreshTokenSuccess,
    failure: refreshTokenFailure,
  },
};

// Selectors with proper RootState typing
export const selectLoginState = (state: RootState) => state.login;
export const selectUser = (state: RootState) => state.login.user;
export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.login.isLoading;
export const selectIsGoogleLoading = (state: RootState) => state.login.isGoogleLoading;
export const selectError = (state: RootState) => state.login.error;
export const selectAccessToken = (state: RootState) => state.login.accessToken;
export const selectRefreshToken = (state: RootState) => state.login.refreshToken;

// Export slice
export default loginSlice;
