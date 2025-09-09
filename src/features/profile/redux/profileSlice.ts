/**
 * Profile Redux Slice
 * Manages profile state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { 
  User, 
  ApiError, 
  ProfileState, 
  UpdateProfileRequest,
  ChangePasswordRequest 
} from '../types/profile.types';

// Initial state - User data removed
const initialState: ProfileState = {
  // Loading states
  isLoading: false,
  isUpdating: false,
  isChangingPassword: false,
  
  // Error states
  error: null,
  updateError: null,
  passwordError: null,
  
  // Success states
  updateSuccess: false,
  passwordChangeSuccess: false,
};

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Get Profile Actions - removed user handling
    getProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getProfileSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    getProfileFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update Profile Actions - removed user handling
    updateProfileRequest: (state, _action: PayloadAction<UpdateProfileRequest>) => {
      state.isUpdating = true;
      state.updateError = null;
      state.updateSuccess = false;
    },
    updateProfileSuccess: (state) => {
      state.isUpdating = false;
      state.updateError = null;
      state.updateSuccess = false; // No success notification needed
    },
    updateProfileFailure: (state, action: PayloadAction<ApiError>) => {
      state.isUpdating = false;
      state.updateError = action.payload;
      state.updateSuccess = false;
    },

    // Change Password Actions
    changePasswordRequest: (state, _action: PayloadAction<ChangePasswordRequest>) => {
      state.isChangingPassword = true;
      state.passwordError = null;
      state.passwordChangeSuccess = false;
    },
    changePasswordSuccess: (state) => {
      state.isChangingPassword = false;
      state.passwordError = null;
      state.passwordChangeSuccess = true;
    },
    changePasswordFailure: (state, action: PayloadAction<ApiError>) => {
      state.isChangingPassword = false;
      state.passwordError = action.payload;
      state.passwordChangeSuccess = false;
    },

    // Utility Actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearPasswordError: (state) => {
      state.passwordError = null;
    },
    clearSuccess: (state) => {
      state.updateSuccess = false;
      state.passwordChangeSuccess = false;
    },
    clearState: (_state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  // Get Profile
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  
  // Update Profile
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  
  // Change Password
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  
  // Utility
  setLoading,
  clearError,
  clearUpdateError,
  clearPasswordError,
  clearSuccess,
  clearState,
} = profileSlice.actions;

// Action creators object for easier imports
export const profileActionCreators = {
  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  setLoading,
  clearError,
  clearUpdateError,
  clearPasswordError,
  clearSuccess,
  clearState,
};

// Selectors - removed selectUser (now in auth slice)
export const selectProfileState = (state: RootState) => state.profile;
export const selectIsLoading = (state: RootState) => state.profile.isLoading;
export const selectIsUpdating = (state: RootState) => state.profile.isUpdating;
export const selectIsChangingPassword = (state: RootState) => state.profile.isChangingPassword;
export const selectError = (state: RootState) => state.profile.error;
export const selectUpdateError = (state: RootState) => state.profile.updateError;
export const selectPasswordError = (state: RootState) => state.profile.passwordError;
export const selectUpdateSuccess = (state: RootState) => state.profile.updateSuccess;
export const selectPasswordChangeSuccess = (state: RootState) => state.profile.passwordChangeSuccess;

// Export reducer
export const profileReducer = profileSlice.reducer;
export default profileSlice.reducer;
