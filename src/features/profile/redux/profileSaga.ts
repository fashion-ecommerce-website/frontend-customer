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
import { updateUserProfile, setUser } from '../../auth/login/redux/loginSlice';
import {
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiError,
} from '../types/profile.types';

// Use require for redux-saga effects to avoid type issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

// API Response interface
interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

import { profileApiService, ApiUserResponse } from '../../../services/api/profileApi';

// Import login User type to avoid conflicts
import { User as LoginUser } from '../../auth/login/types/login.types';

// Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY
function convertDateFromApi(dateString: string): string {
  if (!dateString) return '';
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes('/')) return dateString;
  
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  
  return dateString;
}

// Helper function to convert ApiUserResponse to LoginUser
function convertApiUserToLoginUser(apiUser: ApiUserResponse): LoginUser {
  return {
    id: apiUser.id.toString(),
    email: apiUser.email,
    username: apiUser.username,
    firstName: '', // API doesn't have firstName/lastName, will be empty
    lastName: '',
    phone: apiUser.phone,
    avatar: apiUser.avatarUrl || undefined,
    dob: convertDateFromApi(apiUser.dob), // Convert YYYY-MM-DD to DD/MM/YYYY
    role: 'USER' as const,
    enabled: apiUser.active,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    avatarUrl: apiUser.avatarUrl,
    reason: apiUser.reason,
    lastLoginAt: apiUser.lastLoginAt,
    emailVerified: apiUser.emailVerified,
    phoneVerified: apiUser.phoneVerified,
    roles: apiUser.roles,
    active: apiUser.active,
    // Map rank name, accepting multiple possible API shapes (camelCase, snake_case, nested)
    // Accept multiple possible API shapes for rank
    rankName: apiUser.rankName ?? apiUser.rank_name ?? apiUser.rank?.name ?? undefined,
  };
}

/**
 * Get Profile Saga
 */
function* getProfileSaga(): Generator<unknown, void, unknown> {
  try {
    const response = (yield call(profileApiService.getProfile)) as ApiResponse<ApiUserResponse>;
    
    if (response.success) {
      const user = convertApiUserToLoginUser(response.data);
      // Update user in auth store instead of profile store
      yield put(setUser(user));
      yield put(getProfileSuccess()); // Only update loading state
    } else {
      yield put(getProfileFailure({
        message: response.message || 'Failed to get profile',
        status: 400
      }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as Error & { status: number }).status : 500;
    const errorCode = error instanceof Error && 'code' in error ? 
      (error as Error & { code: string }).code : undefined;
      
    const apiError: ApiError = {
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
    };
    yield put(getProfileFailure(apiError));
  }
}

/**
 * Update Profile Saga
 */
function* updateProfileSaga(action: PayloadAction<UpdateProfileRequest>): Generator<unknown, void, unknown> {
  try {
    const response = (yield call(profileApiService.updateProfile, action.payload)) as ApiResponse<ApiUserResponse>;
    
    if (response.success) {
      const user = convertApiUserToLoginUser(response.data);
      // Update user in auth store instead of profile store
      yield put(updateUserProfile(user));
      yield put(updateProfileSuccess()); // Reset loading state only
    } else {
      yield put(updateProfileFailure({
        message: response.message || 'Failed to update profile',
        status: 400
      }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as Error & { status: number }).status : 500;
    const errorCode = error instanceof Error && 'code' in error ? 
      (error as Error & { code: string }).code : undefined;
      
    const apiError: ApiError = {
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
    };
    yield put(updateProfileFailure(apiError));
  }
}

/**
 * Change Password Saga
 */
function* changePasswordSaga(action: PayloadAction<ChangePasswordRequest>): Generator<unknown, void, unknown> {
  try {
    const response = (yield call(profileApiService.changePassword, action.payload)) as ApiResponse<void>;
    
    if (response.success) {
      yield put(changePasswordSuccess());
    } else {
      yield put(changePasswordFailure({
        message: response.message || 'Failed to change password',
        status: 400
      }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    const errorStatus = error instanceof Error && 'status' in error ? 
      (error as Error & { status: number }).status : 500;
    const errorCode = error instanceof Error && 'code' in error ? 
      (error as Error & { code: string }).code : undefined;
      
    const apiError: ApiError = {
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
    };
    yield put(changePasswordFailure(apiError));
  }
}

/**
 * Profile Root Saga
 * Watches all profile-related actions
 */
export function* profileSaga(): Generator<unknown, void, unknown> {
  yield takeLatest(getProfileRequest.type, getProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
  yield takeLatest(changePasswordRequest.type, changePasswordSaga);
}

export default profileSaga;
