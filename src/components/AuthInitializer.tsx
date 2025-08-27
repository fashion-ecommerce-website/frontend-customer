'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer Component
 * Initializes authentication state when the app starts
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  // This hook will automatically initialize auth state from localStorage
  useAuth();

  return <>{children}</>;
};
