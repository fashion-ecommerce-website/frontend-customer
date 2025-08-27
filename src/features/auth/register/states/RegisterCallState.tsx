'use client';

import React, { useState, useEffect } from 'react';
import { RegisterCallStateProps, User, ApiError, RegisterRequest } from '../types/register.types';
import { authApiService } from '../../../../services/api/authApi';

export const RegisterCallState: React.FC<RegisterCallStateProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApiService.register(data);
      
      if (response.success && response.data) {
        // Store tokens from API response
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Get user info using the new token
        const userResponse = await authApiService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userResponse.data));
          localStorage.setItem('isAuthenticated', 'true');
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError({
        message: errorMessage,
        code: 'REGISTER_ERROR',
        status: 400,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if user is already authenticated on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedIsAuthenticated === 'true') {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error loading stored auth data:', err);
    }
  }, []);

  return (
    <>
      {children({
        user,
        isAuthenticated,
        isLoading,
        error,
        register,
        clearError,
      })}
    </>
  );
};
