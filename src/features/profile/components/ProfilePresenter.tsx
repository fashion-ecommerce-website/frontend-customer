/**
 * Profile Presenter Component
 * Pure UI component for profile management
 */

'use client';

import React, { useState } from 'react';
import { ProfilePresenterProps } from '../types/profile.types';

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
  onClearUpdateError,
  onClearPasswordError,
  onClearSuccess,
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle profile input changes
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    onProfileFormDataChange({
      [name]: value,
    });
  };

  // Handle password input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    onPasswordFormDataChange({
      [name]: value,
    });
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!profileFormData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!profileFormData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (profileFormData.phone && !/^[\d\s\-\+\(\)]+$/.test(profileFormData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordFormData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordFormData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordFormData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfileForm()) {
      onUpdateProfile(profileFormData);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      onChangePassword(passwordFormData);
    }
  };

  // Handle password modal close
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    onClearPasswordError();
    setValidationErrors({});
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
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
        <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm h-fit">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account</h2>
          </div>
          
          <nav className="py-4">
            <ul className="list-none m-0 p-0">
              <li className="m-0">
                <button className="block w-full text-left px-6 py-3 text-blue-500 bg-gray-100 text-sm font-medium transition-all duration-200 border-none cursor-pointer">
                  Purchase information &gt;
                </button>
              </li>
              <li className="m-0">
                <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                  Membership tier information
                </button>
              </li>
              <li className="m-0">
                <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                  Order Information
                </button>
              </li>
              <li className="m-0">
                <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                  Order tracking
                </button>
              </li>
              <li className="m-0">
                <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                  Update your phone
                </button>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-6 pb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Operation Information &gt;</div>
              <ul className="list-none m-0 p-0">
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    Wishlist
                  </button>
                </li>
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    Recently Viewed
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-6 pb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Account Settings &gt;</div>
              <ul className="list-none m-0 p-0">
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    Shipping address
                  </button>
                </li>
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    My info
                  </button>
                </li>
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    Delete account
                  </button>
                </li>
                <li className="m-0">
                  <button className="block w-full text-left px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-sm transition-all duration-200 border-none bg-none cursor-pointer">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Breadcrumb */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <a href="/" className="text-gray-500 hover:text-blue-500 no-underline">HOME</a>
              <span className="text-gray-300">&gt;</span>
              <a href="/account" className="text-gray-500 hover:text-blue-500 no-underline">ACCOUNT</a>
              <span className="text-gray-300">&gt;</span>
              <span className="text-gray-900 font-medium">INFORMATION</span>
            </nav>
          </div>

          {/* Global Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
              <div className="flex items-start">
                <div className="text-red-600 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-900 mb-1">Error</div>
                  <p className="text-sm text-red-800 m-0">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Account Login Section */}
          <section className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-0">ACCOUNT LOGIN</h3>
            
            <div className="flex justify-between items-center mt-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Username</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <button 
                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowPasswordModal(true)}
                disabled={isChangingPassword}
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Account Information Section */}
          <section className="p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">ACCOUNT</h3>
            </div>

            {/* Update Success Message */}
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <div className="text-green-600 mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900 mb-1">Success</div>
                    <p className="text-sm text-green-800 m-0">Profile updated successfully</p>
                  </div>
                </div>
              </div>
            )}

            {/* Update Error */}
            {updateError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-900 mb-1">Error</div>
                    <p className="text-sm text-red-800 m-0">{updateError.message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileFormData.firstName}
                    onChange={handleProfileInputChange}
                    onFocus={handleInputFocus}
                    placeholder="First Name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                    disabled={isUpdating}
                  />
                  {validationErrors.firstName && (
                    <span className="text-sm text-red-800 mt-1">{validationErrors.firstName}</span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileFormData.lastName}
                    onChange={handleProfileInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Last Name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                    disabled={isUpdating}
                  />
                  {validationErrors.lastName && (
                    <span className="text-sm text-red-800 mt-1">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 flex flex-col">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profileFormData.dateOfBirth}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={profileFormData.gender}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md text-base bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileInputChange}
                  placeholder="Phone Number"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                  disabled={isUpdating}
                />
                {validationErrors.phone && (
                  <span className="text-sm text-red-800 mt-1">{validationErrors.phone}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="bg-gray-900 text-white border-none rounded-md px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200 self-start hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isUpdating ? 'Updating...' : 'Update information'}
              </button>
            </form>
          </section>

          {/* Email Section */}
          <section className="px-6 py-6 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Email *</div>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full max-w-md px-3 py-3 border border-gray-300 rounded-md text-base bg-gray-50 cursor-not-allowed"
            />
          </section>
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            margin: '1rem',
          }}>
            <h3 className="text-xl font-semibold mb-4 text-center">
              Change Password
            </h3>

            {/* Password Success Message */}
            {passwordChangeSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <div className="text-green-600 mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900 mb-1">Success</div>
                    <p className="text-sm text-green-800 m-0">Password changed successfully</p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Error */}
            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-900 mb-1">Error</div>
                    <p className="text-sm text-red-800 m-0">{passwordError.message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordFormData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                  disabled={isChangingPassword}
                />
                {validationErrors.currentPassword && (
                  <span className="text-sm text-red-800 mt-1">{validationErrors.currentPassword}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                  disabled={isChangingPassword}
                />
                {validationErrors.newPassword && (
                  <span className="text-sm text-red-800 mt-1">{validationErrors.newPassword}</span>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
                  disabled={isChangingPassword}
                />
                {validationErrors.confirmPassword && (
                  <span className="text-sm text-red-800 mt-1">{validationErrors.confirmPassword}</span>
                )}
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handlePasswordModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-gray-900 text-white border-none rounded-md px-6 py-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
