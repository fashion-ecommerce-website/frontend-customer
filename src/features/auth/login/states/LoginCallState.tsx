/**
 * Login Call State
 * State management component for login feature
 */

'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  loginRequest,
  logoutRequest, 
  clearError,
  selectLoginState 
} from '../redux/loginSlice';
import { LoginCallStateProps, LoginRequest } from '../types/login.types';

export const LoginCallState: React.FC<LoginCallStateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const loginState = useAppSelector(selectLoginState);

  // Login action
  const login = (credentials: LoginRequest) => {
    dispatch(loginRequest(credentials));
  };

  // Logout action
  const logout = () => {
    dispatch(logoutRequest());
  };

  // Clear error action
  const clearErrorAction = () => {
    dispatch(clearError());
  };

  return (
    <>
      {children({
        user: loginState.user,
        isAuthenticated: loginState.isAuthenticated,
        isLoading: loginState.isLoading,
        error: loginState.error,
        login,
        logout,
        clearError: clearErrorAction,
      })}
    </>
  );
};
