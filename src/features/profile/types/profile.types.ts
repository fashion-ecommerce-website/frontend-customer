/**
 * Profile feature types
 * All types related to profile functionality
 */

// Base types
export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string | null;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  roles: string[];
  active: boolean;
  // Additional fields for compatibility
  firstName?: string;
  lastName?: string;
  role?: 'customer' | 'moderator' | 'guest';
  isEmailVerified?: boolean;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

export interface Profile extends User {
  // Additional profile-specific fields
  bio?: string;
  location?: string;
  website?: string;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Profile Request/Response
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  user: User;
  message?: string;
}

// Profile State
export interface ProfileState {
  // User data
  user: User | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isChangingPassword: boolean;
  
  // Error states
  error: ApiError | null;
  updateError: ApiError | null;
  passwordError: ApiError | null;
  
  // Success states
  updateSuccess: boolean;
  passwordChangeSuccess: boolean;
}

// Form Data
export interface ProfileFormData {
  username: string;
  email: string;
  phone: string;
  // Optional fields for backward compatibility
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Component Props
export interface ProfileContainerProps {
  onUpdateSuccess?: (user: User) => void;
  onUpdateError?: (error: ApiError) => void;
  onPasswordChangeSuccess?: () => void;
  onPasswordChangeError?: (error: ApiError) => void;
}

export interface ProfilePresenterProps {
  // Data
  user: User | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isChangingPassword: boolean;
  
  // Error states
  error: ApiError | null;
  updateError: ApiError | null;
  passwordError: ApiError | null;
  
  // Success states
  updateSuccess: boolean;
  passwordChangeSuccess: boolean;
  
  // Form data
  profileFormData: ProfileFormData;
  passwordFormData: ChangePasswordFormData;
  
  // Handlers
  onProfileFormDataChange: (data: Partial<ProfileFormData>) => void;
  onPasswordFormDataChange: (data: Partial<ChangePasswordFormData>) => void;
  onUpdateProfile: (formData: ProfileFormData) => void;
  onChangePassword: (formData: ChangePasswordFormData) => void;
  onClearError: () => void;
  onClearUpdateError: () => void;
  onClearPasswordError: () => void;
  onClearSuccess: () => void;
}

export interface ProfileCallStateProps {
  children: (props: {
    user: User | null;
    isLoading: boolean;
    isUpdating: boolean;
    isChangingPassword: boolean;
    error: ApiError | null;
    updateError: ApiError | null;
    passwordError: ApiError | null;
    updateSuccess: boolean;
    passwordChangeSuccess: boolean;
    getProfile: () => void;
    updateProfile: (data: UpdateProfileRequest) => void;
    changePassword: (data: ChangePasswordRequest) => void;
    clearError: () => void;
    clearUpdateError: () => void;
    clearPasswordError: () => void;
    clearSuccess: () => void;
  }) => React.ReactNode;
}
