/**
 * Profile Presenter Component
 * Pure UI component for profile management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ProfilePresenterProps } from '../types/profile.types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useFormValidation } from '../hooks/useValidation';
import { 
  PageLoadingSpinner, 
  ErrorMessage, 
  Breadcrumb 
} from '../../../components';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileFormSection } from './ProfileFormSection';
import { PasswordChangeModal } from './PasswordChangeModal';
import { UpdateInfoModal, UpdateProfileApiPayload } from './UpdateInfoModal';
import { RecentlyViewed } from './RecentlyViewed';
import { Wishlist } from './Wishlist';
import { AccountOverview } from './AccountOverview';
import { AddressContainer } from '../containers/AddressContainer';

export const ProfilePresenter: React.FC<ProfilePresenterProps> = ({
  initialSection = 'account',
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
  // Default to account overview or use initialSection
  const [activeSidebarSection, setActiveSidebarSection] = useState(initialSection);
  const router = useRouter();
  const { logout } = useAuth();
  
  const {
    validationErrors,
    clearAllErrors,
    validateAndSetErrors,
  } = useFormValidation();

  // Close update info modal on successful update
  useEffect(() => {
    if (updateSuccess && showUpdateInfoModal) {
      setShowUpdateInfoModal(false);
    }
  }, [updateSuccess, showUpdateInfoModal]);

  // Handle profile form submission
  const handleProfileSubmit = (formData: typeof profileFormData) => {
    if (validateAndSetErrors(formData, 'profile')) {
      onUpdateProfile(formData);
      // Close the modal after successful submission
      setShowUpdateInfoModal(false);
    }
  };

  // Handle modal form submission with API format
  const handleModalSubmit = (data: UpdateProfileApiPayload) => {
    // Pass the API payload directly to the unified update function
    onUpdateProfile(data);
    setShowUpdateInfoModal(false);
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

  // Handle update info modal close
  const handleUpdateInfoModalClose = () => {
    setShowUpdateInfoModal(false);
    clearAllErrors();
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Handle sidebar section change
  const handleSidebarSectionChange = (section: string) => {
    if (section === 'logout') {
      logout();
      router.push('/auth/login');
      return;
    }
    setActiveSidebarSection(section);
    // Here you can add logic to show different content based on section
  };

  // Breadcrumb items with dynamic section label
  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'account':
        return 'ACCOUNT';
      case 'wishlist':
        return 'WISHLIST';
      case 'recently-viewed':
        return 'RECENTLY VIEWED';
      case 'my-info':
        return 'MY INFO';
      case 'shipping-address':
        return 'ADDRESSES';
      // Add other cases as needed
      default:
        return '';
    }
  };
  const breadcrumbItems = activeSidebarSection === 'account'
    ? [
        { label: 'HOME', href: '/' },
        { label: 'ACCOUNT', onClick: () => handleSidebarSectionChange('account') }
      ]
    : [
        { label: 'HOME', href: '/' },
        { label: 'ACCOUNT', onClick: () => handleSidebarSectionChange('account') },
        { label: getSectionLabel(activeSidebarSection), isActive: true }
      ];

  // Loading state
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  // No user data
  if (!user) {
    return (
      <div className="px-35 py-15 bg-white">
        <div className="flex items-center justify-center p-8">
          <p>No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex gap-8 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 lg:flex-shrink-0">
          <ProfileSidebar 
            activeSection={activeSidebarSection}
            onSectionChange={handleSidebarSectionChange}
          />
        </div>

        {/* Main Content */}
        <main className="bg-white overflow-hidden flex-1">
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

          {/* Render content based on active section */}
          {activeSidebarSection === 'account' && (
            <AccountOverview user={user} />
          )}
          {activeSidebarSection === 'wishlist' && <Wishlist />}
          {activeSidebarSection === 'recently-viewed' && <RecentlyViewed />}
          {activeSidebarSection === 'shipping-address' && (
            <AddressContainer />
          )}
          {activeSidebarSection === 'my-info' && (
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
          )}
          {/* TODO: add other sections (membership-info, order-info, etc) */}
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

      {/* Update Info Modal */}
      <UpdateInfoModal
        isOpen={showUpdateInfoModal}
        profileFormData={profileFormData}
        isUpdating={isUpdating}
        validationErrors={validationErrors}
        onClose={handleUpdateInfoModalClose}
        onProfileFormDataChange={onProfileFormDataChange}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
