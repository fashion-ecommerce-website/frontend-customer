'use client';

import React from 'react';
import Link from 'next/link';
import { LoginPresenterProps } from '../types/login.types';

export const LoginPresenter: React.FC<LoginPresenterProps> = ({
  isLoading,
  error,
  formData,
  onFormDataChange,
  onSubmit,
  onClearError,
  onLogout,
}) => {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onFormDataChange({
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-wider">LOGIN</h2>
          <p className="text-gray-600 text-sm mb-2 text-start">Register as a member and receive a 10% discount on your first order</p>
          <p className="text-gray-600 text-sm text-start">Enter code: <strong>MLBWELCOME</strong></p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-red-500 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-red-800 mb-1">Error</div>
                <p className="text-red-700 text-sm">{error.message}</p>
              </div>
              <button
                type="button"
                onClick={onClearError}
                className="text-red-500 hover:text-red-700 p-0 bg-none border-none cursor-pointer flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium text-gray-700 mb-2 text-sm tracking-wider">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder=""
              required
              disabled={isLoading}
              className={`p-3 border-2 border-gray-300 transition-all duration-200 bg-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium text-gray-700 mb-2 text-sm tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder=""
              required
              disabled={isLoading}
              className={`p-3 border-2 border-gray-300 transition-all duration-200 bg-white text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black text-white py-4 px-6 font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 mb-6 w-full tracking-wider text-base ${
              isLoading 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
            }`}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
            )}
            {isLoading ? 'Signing in...' : 'LOGIN'}
          </button>

          <div className="text-center mb-4 text-sm">
            <Link href="/auth/forgot-password" className="text-gray-900 hover:underline">Forgot password?</Link>
            <span className="text-gray-500 mx-2">|</span>
            <Link href="/auth/register" className="text-gray-900 hover:underline">Register</Link>
          </div>

          <div className="flex flex-col gap-3">
            <button type="button" className="flex items-center justify-center gap-3 py-4 px-6 bg-red-500 text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 text-sm tracking-wider">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              LOGIN GOOGLE
            </button>
            
            <button type="button" className="flex items-center justify-center gap-3 py-4 px-6 bg-blue-500 text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 text-sm tracking-wider">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              LOGIN FACEBOOK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
