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
import { LoginContainerProps, LoginFormData, User, ApiError } from '../types/login.types';

export const LoginContainer: React.FC<LoginContainerProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Local form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
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
      username: formData.username,
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
        router.push('/profile');
      }
    }
  }, [isAuthenticated, user, isLoading, onLoginSuccess, router]);

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
