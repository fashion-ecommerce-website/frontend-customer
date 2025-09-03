'use client';

import { LoginContainer } from '@/features/auth/login';

export default function LoginPage() {
  return (
    <LoginContainer
      redirectTo="/"
      onLoginSuccess={(user) => {
        console.log('Login successful:', user);
      }}
      onLoginError={(error) => {
        console.error('Login error:', error);
      }}
    />
  );
}
