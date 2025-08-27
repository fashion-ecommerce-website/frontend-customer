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
  User, 
  ApiError 
} from '../types/register.types';

export const RegisterContainer: React.FC<RegisterContainerProps> = ({
  onRegisterSuccess,
  onRegisterError,
}) => {
  // Local state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Local form state
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });

  // Handle form data changes
  const handleFormDataChange = (data: Partial<RegisterFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Handle form submission
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

      if (response.success && response.data) {
        // Create user object from registration response
        const { accessToken, refreshToken, username, email } = response.data;
        
        const user: User = {
          id: '', // Will be filled when we fetch user profile
          username,
          email,
          firstName: '',
          lastName: '',
          role: 'USER',
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(user);
        setIsAuthenticated(true);
        if (onRegisterSuccess) {
          onRegisterSuccess(user);
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
  }, [onRegisterSuccess, onRegisterError]);

  // Handle clear error
  const handleClearError = () => {
    setError(null);
  };

  return (
    <RegisterPresenter
      user={user}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      error={error}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      onClearError={handleClearError}
    />
  );
};
