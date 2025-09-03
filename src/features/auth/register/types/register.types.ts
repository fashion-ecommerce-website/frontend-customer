export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  phone: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
  expiresIn: number;
  username: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface RegisterContainerProps {
  onRegisterSuccess?: (user: User) => void;
  onRegisterError?: (error: ApiError) => void;
  redirectTo?: string;
}

export interface RegisterPresenterProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  formData: RegisterFormData;
  isRegistered?: boolean;
  registrationMessage?: string | null;
  redirectTo?: string;
  onFormDataChange: (data: Partial<RegisterFormData>) => void;
  onSubmit: (data: RegisterFormData) => void;
  onClearError: () => void;
  onResetRegistration?: () => void;
}

