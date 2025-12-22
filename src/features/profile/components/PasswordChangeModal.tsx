/**
 * Password Change Modal Component
 * Modal for changing user password
 */

'use client';

import React, { useEffect } from 'react';
import { ChangePasswordFormData, ApiError } from '../types/profile.types';
import { useToast } from '@/providers/ToastProvider';
import { useLanguage } from '@/hooks/useLanguage';

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
  onClearFieldError?: (fieldName: string) => void;
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
  onClearFieldError,
}) => {
  const { showSuccess, showError } = useToast();
  const { translations } = useLanguage();
  const t = translations.toast;
  
  // Show error via toast when passwordError occurs
  useEffect(() => {
    if (passwordError) {
      // Check if it's a current password error from the API
      const errorMessage = passwordError.message.toLowerCase();
      if (errorMessage.includes('current password') || errorMessage.includes('incorrect')) {
        showError(t.currentPasswordIncorrect);
      } else {
        showError(passwordError.message);
      }
      onClearPasswordError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordError]);
  
  // Show success via toast when password changed
  useEffect(() => {
    if (passwordChangeSuccess) {
      showSuccess(t.passwordChangedSuccess);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordChangeSuccess]);
  
  // Handle password input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
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
