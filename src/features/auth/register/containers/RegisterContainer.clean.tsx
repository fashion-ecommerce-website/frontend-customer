'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { RegisterPresenter } from '../components/RegisterPresenter';
import { RegisterCallState } from '../states/RegisterCallState';
import { 
  RegisterContainerProps, 
  RegisterFormData, 
  User, 
  ApiError 
} from '../types/register.types';

// Inner component that handles the render prop logic
const RegisterContainerInner: React.FC<{
  formData: RegisterFormData;
  handleFormDataChange: (data: Partial<RegisterFormData>) => void;
  handleRegisterSuccess: (user: User) => void;
  handleRegisterError: (error: ApiError) => void;
  handleAuthCheck: (isAuthenticated: boolean, user: User | null) => void;
}> = ({
  formData,
  handleFormDataChange,
  handleRegisterSuccess,
  handleRegisterError,
  handleAuthCheck,
}) => {
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
            email: formData.email,
            password: formData.password,
            username: formData.username,
            phone: formData.phone,
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

export const RegisterContainer: React.FC<RegisterContainerProps> = ({
  onRegisterSuccess,
  onRegisterError,
  redirectTo,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });

  const handleFormDataChange = (data: Partial<RegisterFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const handleRegisterSuccess = (user: User) => {
    if (onRegisterSuccess) {
      onRegisterSuccess(user);
    }
  };

  const handleRegisterError = (error: ApiError) => {
    if (onRegisterError) {
      onRegisterError(error);
    }
  };

  const handleAuthCheck = (isAuthenticated: boolean, user: User | null) => {
    if (isAuthenticated && user) {
      handleRegisterSuccess(user);
    }
  };

  return (
    <RegisterContainerInner
      formData={formData}
      handleFormDataChange={handleFormDataChange}
      handleRegisterSuccess={handleRegisterSuccess}
      handleRegisterError={handleRegisterError}
      handleAuthCheck={handleAuthCheck}
    />
  );
};
