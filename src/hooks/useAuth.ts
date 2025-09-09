/**
 * Auth Hook
 * Custom hook for authentication state management
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser, selectAccessToken, setUser } from '@/features/auth/login/redux/loginSlice';
import { profileApiService, ApiUserResponse } from '@/services/api/profileApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  // Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY
  const convertDateFromApi = (dateString: string): string => {
    if (!dateString) return '';
    
    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes('/')) return dateString;
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  };

  // Helper function to convert ApiUserResponse to User
  const convertApiUserToUser = (apiUser: ApiUserResponse) => {
    return {
      id: apiUser.id.toString(),
      email: apiUser.email,
      username: apiUser.username,
      firstName: '', // API doesn't have firstName/lastName, will be empty
      lastName: '',
      phone: apiUser.phone,
      avatar: apiUser.avatarUrl || undefined,
      dob: convertDateFromApi(apiUser.dob), // Convert YYYY-MM-DD to DD/MM/YYYY
      role: 'USER' as const,
      enabled: apiUser.active,
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt,
      avatarUrl: apiUser.avatarUrl,
      reason: apiUser.reason,
      lastLoginAt: apiUser.lastLoginAt,
      emailVerified: apiUser.emailVerified,
      phoneVerified: apiUser.phoneVerified,
      roles: apiUser.roles,
      active: apiUser.active,
    };
  };

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
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

            // Fetch fresh profile data to ensure it's up to date
            try {
              const profileResponse = await profileApiService.getProfile();
              if (profileResponse.success && profileResponse.data) {
                const fullUserData = convertApiUserToUser(profileResponse.data);
                // Update localStorage with fresh user data
                localStorage.setItem('user', JSON.stringify(fullUserData));
                // Update Redux store with fresh user data
                dispatch(setUser(fullUserData));
              }
            } catch (profileError) {
              console.warn('Failed to fetch fresh profile data:', profileError);
              // Continue with stored user data if profile fetch fails
            }
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