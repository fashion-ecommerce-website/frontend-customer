/**
 * Auth Hook
 * Custom hook for authentication state management
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser, selectAccessToken } from '@/features/auth/login/redux/loginSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Verify token is not expired
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (tokenData.exp > currentTime) {
            // Token is still valid, restore auth state
            dispatch({
              type: 'login/restoreAuthState',
              payload: {
                user: JSON.parse(storedUser),
                accessToken: storedToken,
                isAuthenticated: true,
              }
            });
          } else {
            // Token expired, clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Persist auth state to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated && user && accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user, accessToken]);

  const logout = () => {
    dispatch({ type: 'login/logoutRequest' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return {
    isAuthenticated,
    user,
    accessToken,
    logout,
  };
};