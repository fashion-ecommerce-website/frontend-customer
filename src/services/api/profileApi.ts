import { apiClient } from './baseApi';
import { authUtils } from '@/utils/auth';
import { ApiResponse } from '../../types/api.types';

// API User Response interface - matches actual API response
export interface ApiUserResponse {
  id: number;
  email: string;
  username: string;
  phone: string;
  dob: string;
  avatarUrl: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  roles: string[];
  active: boolean;
}

// Profile API endpoints
const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/users',
  UPDATE_PROFILE: '/users',
  UPLOAD_AVATAR: '/profile/avatar',
  CHANGE_PASSWORD: '/auth/change-password',
} as const;

// Update profile request interface (for backward compatibility)
export interface UpdateProfileRequest {
  username?: string;
  dob?: string; // Date of birth in YYYY-MM-DD format (e.g., "2003-10-12")
  phone?: string;
  // Keep backward compatibility
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
}

// Change password request interface
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  // confirmPassword is optional on the API side; UI may include it for validation
  confirmPassword?: string;
}

// Profile API service
export class ProfileApiService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<ApiUserResponse>> {
    return apiClient.get<ApiUserResponse>(PROFILE_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<ApiUserResponse>> {
    return apiClient.put<ApiUserResponse>(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    // For file upload, we need to override the content type
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${PROFILE_ENDPOINTS.UPLOAD_AVATAR}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authUtils.getAccessToken() || ''}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: data.message || 'Upload failed',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    // Only send the fields expected by the auth/change-password endpoint
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    return apiClient.post<void>(PROFILE_ENDPOINTS.CHANGE_PASSWORD, payload);
  }
}

// Export singleton instance
export const profileApiService = new ProfileApiService();

// Export API functions for saga factories
export const profileApi = {
  getProfile: () => profileApiService.getProfile(),
  updateProfile: (data: UpdateProfileRequest) => profileApiService.updateProfile(data),
  uploadAvatar: (file: File) => profileApiService.uploadAvatar(file),
  changePassword: (data: ChangePasswordRequest) => profileApiService.changePassword(data),
};
