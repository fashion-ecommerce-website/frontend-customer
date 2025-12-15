'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
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

  // // Handle Google login
  // const handleGoogleLogin = () => {
  //   dispatch(googleLoginRequest());
  // };

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
        // Check for returnUrl in query params
        const returnUrl = searchParams.get('returnUrl');
        
        // Using setTimeout to ensure state is fully updated
        setTimeout(() => {
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.push('/');
          }
          // Fallback if router.push doesn't work
          if (typeof window !== 'undefined' && !returnUrl) {
            window.location.href = '/';
          }
        }, 100);
      }
    }
  }, [isAuthenticated, user, isLoading, onLoginSuccess, router, searchParams]);

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
