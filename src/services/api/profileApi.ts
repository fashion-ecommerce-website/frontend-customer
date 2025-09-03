import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { Profile } from '../../features/profile/types/profile.types';

// Profile API endpoints
const PROFILE_ENDPOINTS = {
  GET_PROFILE: '/users',
  UPDATE_PROFILE: '/profile',
  UPLOAD_AVATAR: '/profile/avatar',
  CHANGE_PASSWORD: '/profile/change-password',
} as const;

// Update profile request interface
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
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
  confirmPassword: string;
}

// Profile API service
export class ProfileApiService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<Profile>> {
    return apiClient.get<Profile>(PROFILE_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<Profile>> {
    return apiClient.put<Profile>(PROFILE_ENDPOINTS.UPDATE_PROFILE, data);
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    // For file upload, we need to override the content type
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${PROFILE_ENDPOINTS.UPLOAD_AVATAR}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
    return apiClient.post<void>(PROFILE_ENDPOINTS.CHANGE_PASSWORD, data);
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
