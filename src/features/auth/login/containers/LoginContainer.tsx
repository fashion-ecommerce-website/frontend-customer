/**
 * Login Container Component
 * Smart component that handles business logic for login
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { LoginPresenter } from '../components/LoginPresenter';
import { 
  loginRequest, 
  logoutRequest, 
  clearError,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
} from '../redux/loginSlice';
import { LoginContainerProps, LoginFormData } from '../types/login.types';

export const LoginContainer: React.FC<LoginContainerProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get returnUrl from URL params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const returnUrl = searchParams?.get('returnUrl') || '/profile';
  
  // Redux state
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Local form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // Handle form data changes
  const handleFormDataChange = (data: Partial<LoginFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Handle form submission
  const handleSubmit = (formData: LoginFormData) => {
    dispatch(loginRequest({
      email: formData.email,
      password: formData.password,
    }));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Handle clear error
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      if (onLoginSuccess) {
        onLoginSuccess(user);
      } else {
        // Redirect to returnUrl or default to profile
        router.push(returnUrl);
      }
    }
  }, [isAuthenticated, user, isLoading, onLoginSuccess, router, returnUrl]);

  // Handle authentication errors
  useEffect(() => {
    if (error && !isLoading && onLoginError) {
      onLoginError(error);
    }
  }, [error, isLoading, onLoginError]);

  return (
    <LoginPresenter
      user={user}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      error={error}
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      onClearError={handleClearError}
      onLogout={handleLogout}
    />
  );
};
