/**
 * Register Container Component
 * Smart component that handles business logic for registration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { RegisterPresenter } from '../components/RegisterPresenter';
import { authApi } from '@/services/api/authApi';
import { 
  RegisterContainerProps, 
  RegisterFormData,
  ApiError 
} from '../types/register.types';

export const RegisterContainer: React.FC<RegisterContainerProps> = ({
  onRegisterSuccess,
  onRegisterError,
  redirectTo,
}) => {
  // Simple local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

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
      setError(null);

      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        phone: formData.phone,
      });

      if (response.success) {
        // Just show success message
        setIsRegistered(true);
        setRegistrationMessage('Registration successful! Please login to continue.');
        
        if (onRegisterSuccess) {
          // Minimal user object for callback compatibility
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
        setError({ message: errorMessage });
        if (onRegisterError) {
          onRegisterError({ message: errorMessage });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError({ message: errorMessage });
      if (onRegisterError) {
        onRegisterError({ message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }, [onRegisterSuccess, onRegisterError, formData.username, formData.email]);

  // Handle clear error
  const handleClearError = () => {
    setError(null);
  };

  // Handle reset registration state
  const handleResetRegistration = () => {
    setIsRegistered(false);
    setRegistrationMessage(null);
    setError(null);
  };

  return (
    <RegisterPresenter
      user={null}
      isAuthenticated={false}
      isLoading={isLoading}
      error={error}
      formData={formData}
      isRegistered={isRegistered}
      registrationMessage={registrationMessage}
      redirectTo={redirectTo}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      onClearError={handleClearError}
      onResetRegistration={handleResetRegistration}
    />
  );
};
