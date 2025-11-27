'use client';

import { LoginContainer } from '@/features/auth/login';

export default function LoginPage() {
  return (
    <LoginContainer
      onLoginError={() => {
        // Silently handle login errors
      }}
    />
  );
}
