'use client';

import { LoginContainer } from '@/features/auth/login';
import { useEffect, Suspense } from 'react';
import { useToast } from '@/providers/ToastProvider';

function LoginPageContent() {
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
