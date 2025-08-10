'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterPresenter } from '../components/RegisterPresenter';
import { RegisterCallState } from '../states/RegisterCallState';
import { RegisterContainerProps, RegisterFormData, User, ApiError } from '../types/register.types';

export const RegisterContainer: React.FC<RegisterContainerProps> = ({
  onRegisterSuccess,
  onRegisterError,
  redirectTo = '/auth/login',
}) => {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  // Form data change handler
  const handleFormDataChange = useCallback((data: Partial<RegisterFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Register success handler
  const handleRegisterSuccess = useCallback((user: User) => {
    // Call external success handler if provided
    if (onRegisterSuccess) {
      onRegisterSuccess(user);
    }
    
    // Redirect to specified route after a delay to show success message
    setTimeout(() => {
      router.push(redirectTo);
    }, 2000);
  }, [onRegisterSuccess, redirectTo, router]);

  // Register error handler
  const handleRegisterError = useCallback((error: ApiError) => {
    // Call external error handler if provided
    if (onRegisterError) {
      onRegisterError(error);
    }
    
    // You could also show a toast notification here
    console.error('Register error:', error);
  }, [onRegisterError]);

  // Auto-redirect if already authenticated
  const handleAuthCheck = useCallback((isAuthenticated: boolean, user: User | null) => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [router]);

  return (
    <RegisterCallState>
      {({ user, isAuthenticated, isLoading, error, register, clearError }) => {
        // Auto-redirect check
        useEffect(() => {
          handleAuthCheck(isAuthenticated, user);
        }, [isAuthenticated, user, handleAuthCheck]);

        // Handle form submission
        const handleSubmit = useCallback((formData: RegisterFormData) => {
          register({
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
          });
        }, [register]);

        // Handle register success
        useEffect(() => {
          if (isAuthenticated && user && !isLoading) {
            handleRegisterSuccess(user);
          }
        }, [isAuthenticated, user, isLoading, handleRegisterSuccess]);

        // Handle register error
        useEffect(() => {
          if (error && !isLoading) {
            handleRegisterError(error);
          }
        }, [error, isLoading, handleRegisterError]);

        return (
          <RegisterPresenter
            user={user}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            error={error}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onClearError={clearError}
          />
        );
      }}
    </RegisterCallState>
  );
};
