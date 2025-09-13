'use client';

import { useRouter } from 'next/navigation';
import { RegisterContainer } from '@/features/auth/register';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterContainer
      onRegisterSuccess={(user) => {
        console.log('Registration successful:', user);
        // Redirect to OTP verification page with email query
        router.push(`/auth/verify-otp?email=${encodeURIComponent(user.email)}`);
      }}
      onRegisterError={(error) => {
        console.error('Registration error:', error);
      }}
    />
  );
}
