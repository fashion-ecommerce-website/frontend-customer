'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPresenter } from '../components/LoginPresenter';
import { LoginCallState } from '../states/LoginCallState';
import { LoginContainerProps, LoginFormData, User, ApiError } from '../types/login.types';

export const LoginContainer: React.FC<LoginContainerProps> = ({
  onLoginSuccess,
  onLoginError,
  redirectTo = '/',
}) => {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Form data change handler
  const handleFormDataChange = useCallback((data: Partial<LoginFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Login success handler
  const handleLoginSuccess = useCallback((user: User) => {
    // Call external success handler if provided
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    
    // Redirect to specified route
    router.push(redirectTo);
  }, [onLoginSuccess, redirectTo, router]);

  // Login error handler
  const handleLoginError = useCallback((error: ApiError) => {
    // Call external error handler if provided
    if (onLoginError) {
      onLoginError(error);
    }
    
    // You could also show a toast notification here
    console.error('Login error:', error);
  }, [onLoginError]);

  // Auto-redirect if already authenticated
  const handleAuthCheck = useCallback((isAuthenticated: boolean, user: User | null) => {
    if (isAuthenticated && user) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);

  return (
    <LoginCallState>
      {({ user, isAuthenticated, isLoading, error, login, logout, clearError }) => {
        // Auto-redirect check
        useEffect(() => {
          handleAuthCheck(isAuthenticated, user);
        }, [isAuthenticated, user, handleAuthCheck]);

        // Handle form submission
        const handleSubmit = useCallback((formData: LoginFormData) => {
          login({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
          });
        }, [login]);

        // Handle login success
        useEffect(() => {
          if (isAuthenticated && user && !isLoading) {
            handleLoginSuccess(user);
          }
        }, [isAuthenticated, user, isLoading, handleLoginSuccess]);

        // Handle login error
        useEffect(() => {
          if (error && !isLoading) {
            handleLoginError(error);
          }
        }, [error, isLoading, handleLoginError]);

        return (
          <LoginPresenter
            user={user}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            error={error}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onClearError={clearError}
            onLogout={logout}
          />
        );
      }}
    </LoginCallState>
  );
};
