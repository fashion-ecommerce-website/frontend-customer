/**
 * Register Container Component
 * Smart component that handles business logic for registration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { RegisterPresenter } from '../components/RegisterPresenter';
import { authApi } from '@/services/api/authApi';
import { useToast } from '@/providers/ToastProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  RegisterContainerProps, 
  RegisterFormData
} from '../types/register.types';

export const RegisterContainer: React.FC<RegisterContainerProps> = ({
  onRegisterSuccess,
  onRegisterError,
}) => {
  // Simple local state
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { translations } = useLanguage();
  const t = translations.toast;

  // Local form state
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Handle form data changes
  const handleFormDataChange = (data: Partial<RegisterFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Handle form submission - simple API call
  const handleSubmit = useCallback(async (formData: RegisterFormData) => {
    try {
      setIsLoading(true);
  // clear previous toasts

      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        phone: formData.phone,
      });

      if (response.success) {
        showSuccess(t.registrationSuccess);
        if (onRegisterSuccess) {
          const tempUser = {
            id: '',
            username: formData.username,
            email: formData.email,
            firstName: '',
            lastName: '',
            role: 'USER' as const,
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          onRegisterSuccess(tempUser);
        }
      } else {
        const errorMessage = response.message || 'Registration failed';
        showError(errorMessage);
        if (onRegisterError) {
          onRegisterError({ message: errorMessage });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      showError(errorMessage);
      if (onRegisterError) {
        onRegisterError({ message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }, [onRegisterSuccess, onRegisterError, showSuccess, showError, t.registrationSuccess]);

  // Handle clear error
  // no internal error state, errors shown via toast

  return (
    <RegisterPresenter
      isLoading={isLoading}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
    />
  );
};
