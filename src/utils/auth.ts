/**
 * Authentication utilities
 */

import { cookies } from './cookies';
import { User } from '@/features/auth/login/types/login.types';

export const authUtils = {
  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      cookies.remove('accessToken');
      cookies.remove('refreshToken');
      cookies.remove('user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;

    const accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');

    return !!(accessToken || refreshToken);
  },

  /**
   * Get current access token
   */
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return cookies.get('accessToken');
  },

  /**
   * Get current refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return cookies.get('refreshToken');
  },

  /**
   * Set tokens
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      cookies.set('accessToken', accessToken);
      cookies.set('refreshToken', refreshToken);
    }
  },

  /**
   * Get stored user object (stringified JSON in cookie)
   */
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = cookies.get('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /**
   * Persist user object into cookie
   */
  setUser: (user: User) => {
    if (typeof window === 'undefined') return;
    try {
      cookies.set('user', JSON.stringify(user));
    } catch {
      // ignore
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch {
      return true;
    }
  }
};
