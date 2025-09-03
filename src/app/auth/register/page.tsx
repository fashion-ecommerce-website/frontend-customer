'use client';

import { useRouter } from 'next/navigation';
import { RegisterContainer } from '@/features/auth/register';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterContainer
      redirectTo="/auth/login"
      onRegisterSuccess={(user) => {
        console.log('Registration successful:', user);
        // Redirect to login page after 2 seconds to show success message
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }}
      onRegisterError={(error) => {
        console.error('Registration error:', error);
      }}
    />
  );
}
