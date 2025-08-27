'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPresenter } from '../components/LoginPresenter';
import { LoginCallState } from '../states/LoginCallState';
import { LoginContainerProps, LoginFormData, User, ApiError } from '../types/login.types';

// Inner component that handles the render prop logic
const LoginContainerInner: React.FC<{
  formData: LoginFormData;
  handleFormDataChange: (data: Partial<LoginFormData>) => void;
  handleLoginSuccess: (user: User) => void;
  handleLoginError: (error: ApiError) => void;
  handleAuthCheck: (isAuthenticated: boolean, user: User | null) => void;
}> = ({
  formData,
  handleFormDataChange,
  handleLoginSuccess,
  handleLoginError,
  handleAuthCheck,
}) => {
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
            username: formData.username,
            password: formData.password,
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

export const LoginContainer: React.FC<LoginContainerProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const handleFormDataChange = (data: Partial<LoginFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const handleLoginSuccess = (user: User) => {
    if (onLoginSuccess) {
      onLoginSuccess(user);
    } else {
      router.push('/profile');
    }
  };

  const handleLoginError = (error: ApiError) => {
    if (onLoginError) {
      onLoginError(error);
    }
  };

  const handleAuthCheck = (isAuthenticated: boolean, user: User | null) => {
    if (isAuthenticated && user) {
      handleLoginSuccess(user);
    }
  };

  return (
    <LoginContainerInner
      formData={formData}
      handleFormDataChange={handleFormDataChange}
      handleLoginSuccess={handleLoginSuccess}
      handleLoginError={handleLoginError}
      handleAuthCheck={handleAuthCheck}
    />
  );
};
