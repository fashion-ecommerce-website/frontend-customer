export interface User {
  id: string; // Changed from number to string to match LoginUser
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string | null;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string; // Made optional
  emailVerified?: boolean; // Made optional
  phoneVerified?: boolean; // Made optional
  roles?: string[]; // Made optional
  active?: boolean; // Made optional
  // Additional fields for compatibility
  firstName?: string;
  lastName?: string;
  role?: 'customer' | 'moderator' | 'guest' | 'USER';
  isEmailVerified?: boolean;
  dob?: string; // Date of birth in DD/MM/YYYY format (e.g., "12/10/2003")
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  enabled?: boolean; // Added for compatibility with LoginUser
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
  username?: string;
  dob?: string; // Date of birth in DD/MM/YYYY format (e.g., "12/10/2003")
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ProfileResponse {
  user: User;
  message?: string;
}

// Profile State - User data removed, now only UI states
export interface ProfileState {
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
  dob?: string; // Date of birth in DD/MM/YYYY format (e.g., "12/10/2003")
  gender?: 'male' | 'female' | 'other' | '';
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// Component Props
export interface ProfileContainerProps {
  initialSection?: string;
  onUpdateSuccess?: (user: User) => void;
  onUpdateError?: (error: ApiError) => void;
  onPasswordChangeSuccess?: () => void;
  onPasswordChangeError?: (error: ApiError) => void;
}

export interface ProfilePresenterProps {
  // Configuration
  initialSection?: string;
  
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
  onUpdateProfile: (formData: UpdateProfileRequest) => void;
  onChangePassword: (formData: ChangePasswordFormData) => void;
  onClearError: () => void;
  onClearUpdateError: () => void;
  onClearPasswordError: () => void;
  onClearSuccess: () => void;
}

// ProfileCallState Props (render props pattern)
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

// Review Types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage?: string;
  productColor?: string;
  productSize?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  submitSuccess: boolean;
}

export interface ReviewPresenterProps {
  reviews: Review[];
  totalReviews: number; // Total number of reviews across all pages
  isLoading: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  submitSuccess: boolean;
  lastActionType: 'edit' | 'delete' | null; // Track last successful action
  // Pagination props
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  // Delete confirmation modal
  confirmDelete: { reviewId: string; productName: string } | null;
  onPageChange: (page: number) => void;
  onEditReview: (reviewId: string, data: ReviewFormData) => void;
  onDeleteReview: (reviewId: string) => void;
  onConfirmDelete: (reviewId: string) => void;
  onCancelDelete: () => void;
  onClearError: () => void;
}

export interface ReviewContainerProps {
  onEditSuccess?: () => void;
  onEditError?: (error: ApiError) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: ApiError) => void;
}