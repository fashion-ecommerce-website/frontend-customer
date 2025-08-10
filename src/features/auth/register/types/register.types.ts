export interface RegisterFormData {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role: string;
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
  onFormDataChange: (data: Partial<RegisterFormData>) => void;
  onSubmit: (data: RegisterFormData) => void;
  onClearError: () => void;
}

export interface RegisterCallStateProps {
  children: (state: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ApiError | null;
    register: (data: { fullname: string; email: string; password: string }) => void;
    clearError: () => void;
  }) => React.ReactNode;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}
