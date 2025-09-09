/**
 * Profile Presenter Component
 * Pure UI component for profile management
 */

'use client';

import React, { useState } from 'react';
import { ProfilePresenterProps } from '../types/profile.types';
import { useFormValidation } from '../hooks/useValidation';
import { 
  PageLoadingSpinner, 
  ErrorMessage, 
  SuccessMessage, 
  Breadcrumb 
} from '../../../components';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileFormSection } from './ProfileFormSection';
import { PasswordChangeModal } from './PasswordChangeModal';

export const ProfilePresenter: React.FC<ProfilePresenterProps> = ({
  user,
  isLoading,
  isUpdating,
  isChangingPassword,
  error,
  updateError,
  passwordError,
  updateSuccess,
  passwordChangeSuccess,
  profileFormData,
  passwordFormData,
  onProfileFormDataChange,
  onPasswordFormDataChange,
  onUpdateProfile,
  onChangePassword,
  onClearError,
  onClearPasswordError,
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState('purchase-info');
  
  const {
    validationErrors,
    clearAllErrors,
    validateAndSetErrors,
    handleInputChange,
  } = useFormValidation();

  // Handle profile form submission
  const handleProfileSubmit = (formData: typeof profileFormData) => {
    if (validateAndSetErrors(formData, 'profile')) {
      onUpdateProfile(formData);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = (formData: typeof passwordFormData) => {
    if (validateAndSetErrors(formData, 'password')) {
      onChangePassword(formData);
    }
  };

  // Handle password modal close
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    onClearPasswordError();
    clearAllErrors();
  };

  // Handle password modal open
  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  // Handle update info modal open
  const handleUpdateInfoModalOpen = () => {
    setShowUpdateInfoModal(true);
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Handle sidebar section change
  const handleSidebarSectionChange = (section: string) => {
    setActiveSidebarSection(section);
    // Here you can add logic to show different content based on section
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'HOME', href: '/' },
    { label: 'ACCOUNT', href: '/account' },
    { label: 'INFORMATION', isActive: true }
  ];

  // Loading state
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="flex items-center justify-center p-8">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex gap-8 flex-col lg:flex-row">
        {/* Sidebar */}
        <ProfileSidebar 
          activeSection={activeSidebarSection}
          onSectionChange={handleSidebarSectionChange}
        />

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Global Error */}
          {error && (
            <ErrorMessage 
              message={error.message}
              className="m-4"
            />
          )}



          {/* Update Error */}
          {updateError && (
            <ErrorMessage 
              message={updateError.message}
              className="m-4"
            />
          )}

          <ProfileFormSection
            user={user}
            profileFormData={profileFormData}
            isUpdating={isUpdating}
            validationErrors={validationErrors}
            onProfileFormDataChange={onProfileFormDataChange}
            onSubmit={handleProfileSubmit}
            onInputFocus={handleInputFocus}
            onShowPasswordModal={handlePasswordModalOpen}
            onShowUpdateInfoModal={handleUpdateInfoModalOpen}
            isChangingPassword={isChangingPassword}
          />
        </main>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        passwordFormData={passwordFormData}
        isChangingPassword={isChangingPassword}
        passwordError={passwordError}
        passwordChangeSuccess={passwordChangeSuccess}
        validationErrors={validationErrors}
        onPasswordFormDataChange={onPasswordFormDataChange}
        onChangePassword={handlePasswordSubmit}
        onClose={handlePasswordModalClose}
        onClearPasswordError={onClearPasswordError}
      />
    </div>
  );
};
