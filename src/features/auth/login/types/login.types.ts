/**
 * Login feature types
 * All types related to login functionality
 */

// Base types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'ADMIN' | 'USER';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Login Request/Response

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
  expiresIn: number;
  username: string;
  email: string;
}

// Refresh Token Request/Response
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
  expiresIn: number;
  username: string;
  email: string;
}

// Login State
export interface LoginState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  
  // Loading states
  isLoading: boolean;
  
  // Error states
  error: ApiError | null;
  
  // UI states
  lastLoginAt: string | null;
}

// Form Data

export interface LoginFormData {
  email: string;
  password: string;
}

// Component Props
export interface LoginContainerProps {
  onLoginSuccess?: (user: User) => void;
  onLoginError?: (error: ApiError) => void;
  redirectTo?: string;
}

export interface LoginPresenterProps {
  // Data
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  
  // Error states
  error: ApiError | null;
  
  // Form data
  formData: LoginFormData;
  
  // Handlers
  onFormDataChange: (data: Partial<LoginFormData>) => void;
  onSubmit: (formData: LoginFormData) => void;
  onClearError: () => void;
  onLogout: () => void;
}

export interface LoginCallStateProps {
  children: (props: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ApiError | null;
    login: (credentials: LoginRequest) => void;
    logout: () => void;
    clearError: () => void;
  }) => React.ReactNode;
}
