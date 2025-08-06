'use client';

import { LoginContainer } from '@/features/auth/login';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Demo</h1>
          <p className="text-gray-600">Feature-Based Architecture - Login Feature</p>
        </div>
        <LoginContainer
          redirectTo="/"
          onLoginSuccess={(user) => {
            console.log('Login successful:', user);
          }}
          onLoginError={(error) => {
            console.error('Login error:', error);
          }}
        />
      </div>
    </div>
  );
}
