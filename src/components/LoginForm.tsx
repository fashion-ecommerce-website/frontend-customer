'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading
}: LoginFormProps) {
  const { translations } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-2 p-3 border rounded bg-white">
      <h3 className="font-medium text-gray-800">{translations.auth.login}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">{translations.auth.email}</label>
          <input
            id="login-email"
            type="email"
            placeholder="user1@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">{translations.auth.password}</label>
          <input
            id="login-password"
            type="password"
            placeholder="password123"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? translations.auth.loggingIn : translations.auth.loginButton}
        </button>
      </form>
    </div>
  );
}
