'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi, type BackendUser } from '../services/api/authApi';

export const useGoogleAuthState = () => {
  // Auth state management
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuthState = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          console.log('✅ Google auth state loaded from localStorage');
        }
      } catch (error) {
        console.error('❌ Error loading Google auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuthState();
  }, []);

  // Update auth state
  const updateAuthState = useCallback((newUser: BackendUser, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('✅ Google auth state updated:', newUser);
  }, []);

  // Clear auth state
  const clearAuthState = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Google auth state cleared');
  }, []);

  // Google Login with full flow
  const signInWithGoogle = useCallback(async (): Promise<BackendUser> => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Đăng nhập quá lâu. Vui lòng thử lại.');
      }, 15000); // 15 seconds timeout (reduced from 30)
      
      console.log('🚀 Starting Google authentication...');
      const backendUser = await authApi.authenticateWithGoogle();
      
      // Clear timeout if successful
      if (timeoutId) clearTimeout(timeoutId);
      
      // Update local state after successful login
      const newToken = localStorage.getItem('token'); // authApi already saved it
      if (newToken) {
        updateAuthState(backendUser, newToken);
      }
      
      return backendUser;
      
    } catch (err: unknown) {
      // Clear timeout on error
      if (timeoutId) clearTimeout(timeoutId);
      
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      console.error('❌ Google login failed:', err);
      
      // Don't show error for user cancellation cases
      const isCancelledByUser = errorMessage.includes('đóng cửa sổ') || 
                               errorMessage.includes('bị hủy') || 
                               errorMessage.includes('cancelled') ||
                               errorMessage.includes('popup-closed-by-user');
      
      if (!isCancelledByUser) {
        setError(errorMessage);
      }
      
      clearAuthState(); // Clear any partial state
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateAuthState, clearAuthState]);

  // Google Logout with full flow
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚪 Starting Google logout...');
      await authApi.logout();
      
      // Clear local state after successful logout
      clearAuthState();
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng xuất thất bại';
      console.error('❌ Google logout failed:', err);
      setError(errorMessage);
      // Still clear state even if API call fails
      clearAuthState();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  // Computed values
  const isAuthenticated = !!user && !!token;

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    signInWithGoogle,
    signOut,
    updateAuthState,
    clearAuthState,
    
    // Utilities
    setError, // For manual error handling
  };
};
