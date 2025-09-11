/**
 * Password Change Modal Component
 * Modal for changing user password
 */

'use client';

import React from 'react';
import { ChangePasswordFormData, ApiError } from '../types/profile.types';

interface PasswordChangeModalProps {
  isOpen: boolean;
  passwordFormData: ChangePasswordFormData;
  isChangingPassword: boolean;
  passwordError: ApiError | null;
  passwordChangeSuccess: boolean;
  validationErrors: Record<string, string>;
  onPasswordFormDataChange: (data: Partial<ChangePasswordFormData>) => void;
  onChangePassword: (data: ChangePasswordFormData) => void;
  onClose: () => void;
  onClearPasswordError: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  passwordFormData,
  isChangingPassword,
  passwordError,
  passwordChangeSuccess,
  validationErrors,
  onPasswordFormDataChange,
  onChangePassword,
  onClose,
  onClearPasswordError,
}) => {
  // Handle password input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onPasswordFormDataChange({
      [name]: value,
    });
  };

  // Handle password form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangePassword(passwordFormData);
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    onClearPasswordError();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <h3 className="text-xl text-black font-semibold mb-4 text-center">
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

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-black"
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
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-black"
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
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder-gray-400 text-black"
              disabled={isChangingPassword}
            />
            {validationErrors.confirmPassword && (
              <span className="text-sm text-red-800 mt-1">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border text-black border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};
