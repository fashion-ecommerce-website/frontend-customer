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
// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { call, put, takeLatest } = effects;

// API Response interface
interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

import { profileApiService } from '../../../services/api/profileApi';

/**
 * Get Profile Saga
 */
function* getProfileSaga(): Generator<unknown, void, unknown> {
  try {
    const response = (yield call(profileApiService.getProfile)) as ApiResponse<User>;
    
    if (response.success) {
      yield put(getProfileSuccess(response.data));
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
    const response = (yield call(profileApiService.updateProfile, action.payload)) as ApiResponse<User>;
    
    if (response.success) {
      yield put(updateProfileSuccess(response.data));
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
