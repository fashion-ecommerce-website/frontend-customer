/**
 * Profile Container Component
 * Smart component that handles business logic for profile management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ProfilePresenter } from '../components/ProfilePresenter';
import { ProfileCallState } from '../states/ProfileCallState';
import { 
  ProfileContainerProps, 
  ProfileFormData, 
  ChangePasswordFormData,
  User,
  ApiError
} from '../types/profile.types';

// Inner component that handles the render prop logic
const ProfileContainerInner: React.FC<{
  profileFormData: ProfileFormData;
  passwordFormData: ChangePasswordFormData;
  handleProfileFormDataChange: (data: Partial<ProfileFormData>) => void;
  handlePasswordFormDataChange: (data: Partial<ChangePasswordFormData>) => void;
  onUpdateSuccess?: (user: User) => void;
  onUpdateError?: (error: ApiError) => void;
  onPasswordChangeSuccess?: () => void;
  onPasswordChangeError?: (error: ApiError) => void;
}> = ({
  profileFormData,
  passwordFormData,
  handleProfileFormDataChange,
  handlePasswordFormDataChange,
  onUpdateSuccess,
  onUpdateError,
  onPasswordChangeSuccess,
  onPasswordChangeError,
}) => {
  return (
    <ProfileCallState>
      {({ 
        user, 
        isLoading, 
        isUpdating, 
        isChangingPassword,
        error, 
        updateError, 
        passwordError,
        updateSuccess,
        passwordChangeSuccess,
        updateProfile, 
        changePassword, 
        clearError,
        clearUpdateError,
        clearPasswordError,
        clearSuccess,
      }) => {
        // Update form data when user data changes
        useEffect(() => {
          if (user) {
            handleProfileFormDataChange({
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone || '',
              dateOfBirth: '',
              gender: '',
            });
          }
        }, [user, handleProfileFormDataChange]);

        // Handle update success
        useEffect(() => {
          if (updateSuccess && onUpdateSuccess && user) {
            onUpdateSuccess(user);
          }
        }, [updateSuccess, onUpdateSuccess, user]);

        // Handle password change success
        useEffect(() => {
          if (passwordChangeSuccess && onPasswordChangeSuccess) {
            onPasswordChangeSuccess();
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

        // Wrapper function to handle profile update
        const handleUpdateProfile = (formData: ProfileFormData) => {
          const updateData = {
            firstName: formData.firstName || undefined,
            lastName: formData.lastName || undefined,
            phone: formData.phone || undefined,
            dateOfBirth: formData.dateOfBirth || undefined,
            gender: formData.gender === '' ? undefined : formData.gender as 'male' | 'female' | 'other',
          };
          updateProfile(updateData);
        };

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
            onChangePassword={changePassword}
            onClearError={clearError}
            onClearUpdateError={clearUpdateError}
            onClearPasswordError={clearPasswordError}
            onClearSuccess={clearSuccess}
          />
        );
      }}
    </ProfileCallState>
  );
};

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  onUpdateSuccess,
  onUpdateError,
  onPasswordChangeSuccess,
  onPasswordChangeError,
}) => {
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const [passwordFormData, setPasswordFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle profile form data changes
  const handleProfileFormDataChange = (data: Partial<ProfileFormData>) => {
    setProfileFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Handle password form data changes
  const handlePasswordFormDataChange = (data: Partial<ChangePasswordFormData>) => {
    setPasswordFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <ProfileContainerInner
      profileFormData={profileFormData}
      passwordFormData={passwordFormData}
      handleProfileFormDataChange={handleProfileFormDataChange}
      handlePasswordFormDataChange={handlePasswordFormDataChange}
      onUpdateSuccess={onUpdateSuccess}
      onUpdateError={onUpdateError}
      onPasswordChangeSuccess={onPasswordChangeSuccess}
      onPasswordChangeError={onPasswordChangeError}
    />
  );
};
