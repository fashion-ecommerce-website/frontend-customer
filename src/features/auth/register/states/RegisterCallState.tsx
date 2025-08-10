'use client';

import React, { useState, useEffect } from 'react';
import { RegisterCallStateProps, User, ApiError, RegisterRequest } from '../types/register.types';

// Mock API call for register
const mockRegisterApi = async (data: RegisterRequest): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate validation errors
  if (data.email === 'admin@test.com') {
    throw new Error('Email already exists');
  }

  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Return mock user data
  return {
    id: Math.random().toString(36).substr(2, 9),
    fullname: data.fullname,
    email: data.email,
    role: 'customer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

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

      const userData = await mockRegisterApi(data);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
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
