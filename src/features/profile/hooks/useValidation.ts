/**
 * Profile Validation Hooks
 * Custom hooks for form validation logic
 */

'use client';

import { useState, useCallback } from 'react';
import { ProfileFormData, ChangePasswordFormData } from '../types/profile.types';

// Hook for validation errors
export const useValidationErrors = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((fieldName: string) => {
    setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    clearFieldError,
    setFieldError,
    clearAllErrors,
    setValidationErrors,
  };
};

// Hook for profile form validation
export const useProfileValidation = () => {
  const validateProfileForm = useCallback((profileFormData: ProfileFormData) => {
    const errors: Record<string, string> = {};

    // Validate username (required)
    if (!profileFormData.username || !profileFormData.username.trim()) {
      errors.username = 'Username is required.';
    }

    // Validate date of birth (required)
    if (!profileFormData.dob || !profileFormData.dob.trim()) {
      errors.dob = 'Date of Birth is required.';
    } else {
      // Parse date from input (YYYY-MM-DD format from date input) or DD/MM/YYYY format
      let dateToValidate: Date | null = null;
      
      if (profileFormData.dob.includes('-')) {
        // YYYY-MM-DD format (from date input)
        dateToValidate = new Date(profileFormData.dob);
      } else if (profileFormData.dob.includes('/')) {
        // DD/MM/YYYY or MM/DD/YYYY format
        const parts = profileFormData.dob.split('/');
        if (parts.length === 3) {
          const [first, second, third] = parts;
          // Try MM/DD/YYYY format
          dateToValidate = new Date(`${third}-${first}-${second}`);
          
          // If invalid, it might be DD/MM/YYYY
          if (isNaN(dateToValidate.getTime())) {
            dateToValidate = new Date(`${third}-${second}-${first}`);
          }
        }
      }

      // Check if date is valid
      if (!dateToValidate || isNaN(dateToValidate.getTime())) {
        errors.dob = 'Invalid Date Format mm/dd/yyyy.';
      } else {
        // Check if date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        if (dateToValidate > today) {
          errors.dob = 'The date can not be a future';
        }
      }
    }

    // Validate phone number (required)
    if (!profileFormData.phone || !profileFormData.phone.trim()) {
      errors.phone = 'Phone is required.';
    } else {
      // Phone validation - must be 10-15 digits, can contain spaces, dashes, parentheses, and plus sign
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      const cleanPhone = profileFormData.phone.replace(/[\s\-\(\)\.]/g, '');
      
      if (!phoneRegex.test(profileFormData.phone) || cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.phone = 'Invalid phone number.';
      }
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }, []);

  return { validateProfileForm };
};

// Hook for password form validation
export const usePasswordValidation = () => {
  const validatePasswordForm = useCallback((passwordFormData: ChangePasswordFormData) => {
    const errors: Record<string, string> = {};

    // Check if current password is empty
    if (!passwordFormData.currentPassword || !passwordFormData.currentPassword.trim()) {
      errors.currentPassword = 'Current Password is required.';
    }

    // Check if new password is empty
    if (!passwordFormData.newPassword || !passwordFormData.newPassword.trim()) {
      errors.newPassword = 'New Password is required.';
    } else if (passwordFormData.newPassword.length < 6) {
      // Check if new password meets minimum length requirement
      errors.newPassword = 'Password must be at least 6 characters.';
    }

    // Check if confirm password is empty
    if (!passwordFormData.confirmPassword || !passwordFormData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required.';
    } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      // Check if passwords match
      errors.confirmPassword = 'Passwords do not match.';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }, []);

  return { validatePasswordForm };
};

// Combined validation hook
export const useFormValidation = () => {
  const { validationErrors, clearFieldError, setFieldError, clearAllErrors, setValidationErrors } = useValidationErrors();
  const { validateProfileForm } = useProfileValidation();
  const { validatePasswordForm } = usePasswordValidation();

  const validateAndSetErrors = useCallback((
    formData: ProfileFormData | ChangePasswordFormData,
    formType: 'profile' | 'password'
  ) => {
    let validation;
    
    if (formType === 'profile') {
      validation = validateProfileForm(formData as ProfileFormData);
    } else {
      validation = validatePasswordForm(formData as ChangePasswordFormData);
    }

    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [validateProfileForm, validatePasswordForm, setValidationErrors]);

  const handleInputChange = useCallback((fieldName: string) => {
    // Clear validation error for this field when user starts typing
    if (validationErrors[fieldName]) {
      clearFieldError(fieldName);
    }
  }, [validationErrors, clearFieldError]);

  return {
    validationErrors,
    clearFieldError,
    setFieldError,
    clearAllErrors,
    validateAndSetErrors,
    handleInputChange,
  };
};
