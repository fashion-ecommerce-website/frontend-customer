'use client';

import { RegisterContainer } from '@/features/auth/register';

export default function RegisterPage() {
  return (
    <RegisterContainer
      redirectTo="/auth/login"
      onRegisterSuccess={(user) => {
        console.log('Registration successful:', user);
      }}
      onRegisterError={(error) => {
        console.error('Registration error:', error);
      }}
    />
  );
}
