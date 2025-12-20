import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { UserMeasurements } from '../../types/size-recommendation.types';

export interface UserProfileResponse {
  id: number;
  gender: string;
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bmi: number;
  bellyShape: string;
  hipShape: string;
  chestShape?: string;
  fitPreference: string;
  hasReturnHistory: boolean;
  updatedAt: string;
}

export interface UserProfileRequest {
  gender: string;
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bellyShape: string;
  hipShape: string;
  chestShape?: string;
  fitPreference: string;
}

const USER_PROFILE_ENDPOINTS = {
  GET_PROFILE: '/user/profile',
  SAVE_PROFILE: '/user/profile',
  CHECK_EXISTS: '/user/profile/exists',
} as const;

export class UserProfileApiService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return apiClient.get<UserProfileResponse>(USER_PROFILE_ENDPOINTS.GET_PROFILE);
  }

  /**
   * Save or update user profile
   */
  async saveProfile(profile: UserProfileRequest): Promise<ApiResponse<UserProfileResponse>> {
    return apiClient.post<UserProfileResponse>(USER_PROFILE_ENDPOINTS.SAVE_PROFILE, profile);
  }

  /**
   * Check if user has profile
   */
  async hasProfile(): Promise<ApiResponse<boolean>> {
    return apiClient.get<boolean>(USER_PROFILE_ENDPOINTS.CHECK_EXISTS);
  }

  /**
   * Convert UserMeasurements to UserProfileRequest
   */
  convertToProfileRequest(measurements: UserMeasurements): UserProfileRequest {
    return {
      gender: measurements.gender,
      height: measurements.height,
      weight: measurements.weight,
      chest: measurements.chest,
      waist: measurements.waist,
      hips: measurements.hips,
      bellyShape: measurements.bellyShape || 'NORMAL',
      hipShape: measurements.hipShape || 'NORMAL',
      chestShape: measurements.chestShape,
      fitPreference: measurements.fitPreference || 'COMFORTABLE',
    };
  }

  /**
   * Convert UserProfileResponse to UserMeasurements
   */
  convertToMeasurements(profile: UserProfileResponse): UserMeasurements {
    return {
      gender: profile.gender as 'MALE' | 'FEMALE',
      height: profile.height,
      weight: profile.weight,
      chest: profile.chest,
      waist: profile.waist,
      hips: profile.hips,
      bmi: profile.bmi,
      bellyShape: profile.bellyShape as 'FLAT' | 'NORMAL' | 'ROUND',
      hipShape: profile.hipShape as 'NARROW' | 'NORMAL' | 'WIDE',
      chestShape: profile.chestShape as 'SLIM' | 'NORMAL' | 'BROAD',
      fitPreference: profile.fitPreference as 'TIGHT' | 'COMFORTABLE' | 'LOOSE',
      hasReturnHistory: profile.hasReturnHistory,
    };
  }
}

export const userProfileApiService = new UserProfileApiService();

export const userProfileApi = {
  getProfile: () => userProfileApiService.getProfile(),
  saveProfile: (profile: UserProfileRequest) => userProfileApiService.saveProfile(profile),
  hasProfile: () => userProfileApiService.hasProfile(),
  convertToProfileRequest: (measurements: UserMeasurements) => 
    userProfileApiService.convertToProfileRequest(measurements),
  convertToMeasurements: (profile: UserProfileResponse) => 
    userProfileApiService.convertToMeasurements(profile),
};
