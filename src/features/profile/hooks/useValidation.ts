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

    // Validate phone number if provided
    if (profileFormData.phone && !/^[\d\s\-\+\(\)]+$/.test(profileFormData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Optional: Add more validations
    // if (!profileFormData.firstName.trim()) {
    //   errors.firstName = 'First name is required';
    // }

    // if (!profileFormData.lastName.trim()) {
    //   errors.lastName = 'Last name is required';
    // }

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
