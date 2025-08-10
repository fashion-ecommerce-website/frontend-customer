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
  ChangePasswordFormData 
} from '../types/profile.types';

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

  // Reset password form after successful change
  const resetPasswordForm = () => {
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

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
        getProfile,
        updateProfile, 
        changePassword, 
        clearError,
        clearUpdateError,
        clearPasswordError,
        clearSuccess,
      }) => {
        // Initialize form data when user data loads
        useEffect(() => {
          if (user && (!profileFormData.firstName || !profileFormData.lastName)) {
            setProfileFormData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              phone: user.phone || '',
              dateOfBirth: user.dateOfBirth || '',
              gender: user.gender || '',
            });
          }
        }, [user, profileFormData.firstName, profileFormData.lastName]);

        // Handle successful update
        useEffect(() => {
          if (updateSuccess) {
            onUpdateSuccess?.(user!);
            // Clear success after a delay
            setTimeout(() => {
              clearSuccess();
            }, 3000);
          }
        }, [updateSuccess, user, onUpdateSuccess, clearSuccess]);

        // Handle successful password change
        useEffect(() => {
          if (passwordChangeSuccess) {
            onPasswordChangeSuccess?.();
            resetPasswordForm();
            // Clear success after a delay
            setTimeout(() => {
              clearSuccess();
            }, 3000);
          }
        }, [passwordChangeSuccess, onPasswordChangeSuccess, clearSuccess]);

        // Handle update error
        useEffect(() => {
          if (updateError) {
            onUpdateError?.(updateError);
          }
        }, [updateError, onUpdateError]);

        // Handle password change error
        useEffect(() => {
          if (passwordError) {
            onPasswordChangeError?.(passwordError);
          }
        }, [passwordError, onPasswordChangeError]);

        // Handle profile update
        const handleUpdateProfile = (formData: ProfileFormData) => {
          updateProfile({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender as 'male' | 'female' | 'other' | undefined,
          });
        };

        // Handle password change
        const handleChangePassword = (formData: ChangePasswordFormData) => {
          changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          });
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
            onChangePassword={handleChangePassword}
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
