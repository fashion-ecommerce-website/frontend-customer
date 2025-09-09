/**
 * Profile Call State Component
 * Manages profile state and provides data to child components
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  getProfileRequest,
  updateProfileRequest,
  changePasswordRequest,
  clearError,
  clearUpdateError,
  clearPasswordError,
  clearSuccess,
  selectIsLoading,
  selectIsUpdating,
  selectIsChangingPassword,
  selectError,
  selectUpdateError,
  selectPasswordError,
  selectUpdateSuccess,
  selectPasswordChangeSuccess,
} from '../redux/profileSlice';
import { selectUser } from '../../auth/login/redux/loginSlice';
import { User } from '../../auth/login/types/login.types';
import {
  ProfileCallStateProps,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../types/profile.types';

export const ProfileCallState: React.FC<ProfileCallStateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isChangingPassword = useAppSelector(selectIsChangingPassword);
  const error = useAppSelector(selectError);
  const updateError = useAppSelector(selectUpdateError);
  const passwordError = useAppSelector(selectPasswordError);
  const updateSuccess = useAppSelector(selectUpdateSuccess);
  const passwordChangeSuccess = useAppSelector(selectPasswordChangeSuccess);

  // Action handlers using Redux actions (sagas will handle the API calls)
  const handleGetProfile = useCallback(() => {
    dispatch(getProfileRequest());
  }, [dispatch]);

  // No need to load profile - user comes from login state

  const handleUpdateProfile = (data: UpdateProfileRequest) => {
    dispatch(updateProfileRequest(data));
  };

  const handleChangePassword = (data: ChangePasswordRequest) => {
    dispatch(changePasswordRequest(data));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearUpdateError = () => {
    dispatch(clearUpdateError());
  };

  const handleClearPasswordError = () => {
    dispatch(clearPasswordError());
  };

  const handleClearSuccess = () => {
    dispatch(clearSuccess());
  };

  return (
    <>
      {children({
        user,
        isLoading,
        isUpdating,
        isChangingPassword,
        error,
        updateError,
        passwordError,
        updateSuccess,
        passwordChangeSuccess,
        getProfile: handleGetProfile,
        updateProfile: handleUpdateProfile,
        changePassword: handleChangePassword,
        clearError: handleClearError,
        clearUpdateError: handleClearUpdateError,
        clearPasswordError: handleClearPasswordError,
        clearSuccess: handleClearSuccess,
      })}
    </>
  );
};
