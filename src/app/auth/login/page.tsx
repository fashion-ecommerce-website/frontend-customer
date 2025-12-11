'use client';

import { LoginContainer } from '@/features/auth/login';
import { useEffect } from 'react';
import { useToast } from '@/providers/ToastProvider';

export default function LoginPage() {
  const { showError } = useToast();

  useEffect(() => {
    // Check for auth error in sessionStorage
    const authError = sessionStorage.getItem('authError');
    if (authError) {
      showError(authError);
      // Clear the error after showing it
      sessionStorage.removeItem('authError');
    }
  }, [showError]);

  return (
    <LoginContainer
      onLoginError={(error) => {
        console.error('Login error:', error);
      }}
    />
  );
}
