/**
 * Profile Container Component
 * Smart component that handles business logic for profile management
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { ProfilePresenter } from '../components/ProfilePresenter';
import { 
  getProfileRequest,
  updateProfileRequest,
  changePasswordRequest,
  clearError,
  clearUpdateError,
  clearPasswordError,
  clearSuccess,
  selectUser,
  selectIsLoading,
  selectIsUpdating,
  selectIsChangingPassword,
  selectError,
  selectUpdateError,
  selectPasswordError,
  selectUpdateSuccess,
  selectPasswordChangeSuccess,
} from '../redux/profileSlice';
import { 
  ProfileContainerProps, 
  ProfileFormData, 
  ChangePasswordFormData,
} from '../types/profile.types';

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  onUpdateSuccess,
  onUpdateError,
  onPasswordChangeSuccess,
  onPasswordChangeError,
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isChangingPassword = useAppSelector(selectIsChangingPassword);
  const error = useAppSelector(selectError);
  const updateError = useAppSelector(selectUpdateError);
  const passwordError = useAppSelector(selectPasswordError);
  const updateSuccess = useAppSelector(selectUpdateSuccess);
  const passwordChangeSuccess = useAppSelector(selectPasswordChangeSuccess);

  // Local form state
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load profile on mount
  useEffect(() => {
    if (!user) {
      dispatch(getProfileRequest());
    }
  }, [user, dispatch]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setProfileFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  // Handle successful update
  useEffect(() => {
    if (updateSuccess && user && onUpdateSuccess) {
      onUpdateSuccess(user);
    }
  }, [updateSuccess, user, onUpdateSuccess]);

  // Handle successful password change
  useEffect(() => {
    if (passwordChangeSuccess && onPasswordChangeSuccess) {
      onPasswordChangeSuccess();
      // Reset password form
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [passwordChangeSuccess, onPasswordChangeSuccess]);

  // Handle update error
  useEffect(() => {
    if (updateError && onUpdateError) {
      onUpdateError(updateError);
    }
  }, [updateError, onUpdateError]);

  // Handle password change error
  useEffect(() => {
    if (passwordError && onPasswordChangeError) {
      onPasswordChangeError(passwordError);
    }
  }, [passwordError, onPasswordChangeError]);

  // Handle profile form data changes
  const handleProfileFormDataChange = useCallback((data: Partial<ProfileFormData>) => {
    setProfileFormData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Handle password form data changes
  const handlePasswordFormDataChange = useCallback((data: Partial<ChangePasswordFormData>) => {
    setPasswordFormData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Handle profile update
  const handleUpdateProfile = useCallback((formData: ProfileFormData) => {
    const updateData = {
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender === '' ? undefined : formData.gender as 'male' | 'female' | 'other',
    };
    dispatch(updateProfileRequest(updateData));
  }, [dispatch]);

  // Handle password change
  const handleChangePassword = useCallback((formData: ChangePasswordFormData) => {
    dispatch(changePasswordRequest({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    }));
  }, [dispatch]);

  // Handle clear error actions
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearUpdateError = useCallback(() => {
    dispatch(clearUpdateError());
  }, [dispatch]);

  const handleClearPasswordError = useCallback(() => {
    dispatch(clearPasswordError());
  }, [dispatch]);

  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  return (
    <ProfilePresenter
      user={user}
      isLoading={isLoading}
      isUpdating={isUpdating}
      isChangingPassword={isChangingPassword}
      error={error}
      updateError={updateError}
      passwordError={passwordError}
      updateSuccess={updateSuccess}
      passwordChangeSuccess={passwordChangeSuccess}
      profileFormData={profileFormData}
      passwordFormData={passwordFormData}
      onProfileFormDataChange={handleProfileFormDataChange}
      onPasswordFormDataChange={handlePasswordFormDataChange}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      onClearError={handleClearError}
      onClearUpdateError={handleClearUpdateError}
      onClearPasswordError={handleClearPasswordError}
      onClearSuccess={handleClearSuccess}
    />
  );
};
