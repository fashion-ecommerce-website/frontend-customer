'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  phone: string;
  onUsernameChange: (username: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onPhoneChange: (phone: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function RegisterForm({
  username,
  email,
  password,
  phone,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onPhoneChange,
  onSubmit,
  isLoading
}: RegisterFormProps) {
  const { translations } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isFormValid = username && email && password && phone;

  return (
    <div className="space-y-2 p-3 border rounded bg-white">
      <h3 className="font-medium text-gray-800">{translations.auth.register}</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder={translations.auth.username}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          required
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder={translations.auth.email}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder={translations.auth.password}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          required
          disabled={isLoading}
        />
        <input
          type="tel"
          placeholder={translations.auth.phoneNumber}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? translations.auth.registering : translations.auth.registerButton}
        </button>
      </form>
    </div>
  );
}
