/**
 * Profile Redux Saga
 * Handles side effects for profile actions
 */

import { PayloadAction } from '@reduxjs/toolkit';
import {
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
} from './profileSlice';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
  ApiError,
} from '../types/profile.types';

// Use require for redux-saga effects to avoid type issues
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

// API Response interface
interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

// Mock API calls (replace with actual API service later)
const profileApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user profile
    return {
      success: true,
      data: {
        id: '1',
        email: 'lhphuc12102003@gmail.com',
        firstName: 'Lê',
        lastName: 'Phúc',
        phone: '',
        avatar: undefined,
        role: 'customer' as const,
        isEmailVerified: true,
        dateOfBirth: '',
        gender: 'male' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful update
    return {
      success: true,
      data: {
        id: '1',
        email: 'lhphuc12102003@gmail.com',
        firstName: data.firstName || 'Lê',
        lastName: data.lastName || 'Phúc',
        phone: data.phone || '',
        avatar: undefined,
        role: 'customer' as const,
        isEmailVerified: true,
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'male' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful password change
    return {
      success: true,
      data: undefined,
      message: 'Password changed successfully',
    };
  },
};

/**
 * Get Profile Saga
 */
function* getProfileSaga(): Generator<any, void, unknown> {
  try {
    const response = (yield call(profileApi.getProfile)) as ApiResponse<User>;
    
    if (response.success) {
      yield put(getProfileSuccess(response.data));
    } else {
      yield put(getProfileFailure({
        message: response.message || 'Failed to get profile',
        status: 400
      }));
    }
  } catch (error: any) {
    const apiError: ApiError = {
      message: error?.message || 'Network error occurred',
      status: error?.status || 500,
      code: error?.code,
    };
    yield put(getProfileFailure(apiError));
  }
}

/**
 * Update Profile Saga
 */
function* updateProfileSaga(action: PayloadAction<UpdateProfileRequest>): Generator<any, void, unknown> {
  try {
    const response = (yield call(profileApi.updateProfile, action.payload)) as ApiResponse<User>;
    
    if (response.success) {
      yield put(updateProfileSuccess(response.data));
    } else {
      yield put(updateProfileFailure({
        message: response.message || 'Failed to update profile',
        status: 400
      }));
    }
  } catch (error: any) {
    const apiError: ApiError = {
      message: error?.message || 'Network error occurred',
      status: error?.status || 500,
      code: error?.code,
    };
    yield put(updateProfileFailure(apiError));
  }
}

/**
 * Change Password Saga
 */
function* changePasswordSaga(action: PayloadAction<ChangePasswordRequest>): Generator<any, void, unknown> {
  try {
    const response = (yield call(profileApi.changePassword, action.payload)) as ApiResponse<void>;
    
    if (response.success) {
      yield put(changePasswordSuccess());
    } else {
      yield put(changePasswordFailure({
        message: response.message || 'Failed to change password',
        status: 400
      }));
    }
  } catch (error: any) {
    const apiError: ApiError = {
      message: error?.message || 'Network error occurred',
      status: error?.status || 500,
      code: error?.code,
    };
    yield put(changePasswordFailure(apiError));
  }
}

/**
 * Profile Root Saga
 * Watches all profile-related actions
 */
export function* profileSaga(): Generator<any, void, unknown> {
  yield takeLatest(getProfileRequest.type, getProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
  yield takeLatest(changePasswordRequest.type, changePasswordSaga);
}

export default profileSaga;
