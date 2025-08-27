'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RegisterPresenterProps } from '../types/register.types';

export const RegisterPresenter: React.FC<RegisterPresenterProps> = ({
  user,
  isAuthenticated,
  isLoading,
  error,
  formData,
  onFormDataChange,
  onSubmit,
  onClearError,
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    onFormDataChange({
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(formData);
  };

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) {
      onClearError();
    }
  };

  // Show success state if authenticated
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg text-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-600 mb-2">Welcome to Fashion Store!</h2>
            <p className="text-gray-600 text-sm">Your account has been created successfully.</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-8 flex items-center gap-4">
            <div className="text-green-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-green-800 mb-2">Registration Successful</div>
              <div className="text-green-700 text-sm">
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Ready to start shopping? <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Sign in to your account</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show register form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-wider">REGISTER</h2>
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
                <div className="font-semibold text-red-800 mb-1">Registration Failed</div>
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
              className={`p-3 border-2 transition-all duration-200 bg-white text-base ${
                validationErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
            {validationErrors.email && (
              <div className="text-red-500 text-xs mt-1">{validationErrors.email}</div>
            )}
          </div>

           <div className="flex flex-col">
            <label htmlFor="phone" className="font-medium text-gray-700 mb-2 text-sm tracking-wider">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder=""
              required
              disabled={isLoading}
              className={`p-3 border-2 transition-all duration-200 bg-white text-base ${
                validationErrors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
            {validationErrors.phone && (
              <div className="text-red-500 text-xs mt-1">{validationErrors.phone}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="username" className="font-medium text-gray-700 mb-2 text-sm tracking-wider">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder=""
              required
              disabled={isLoading}
              className={`p-3 border-2 transition-all duration-200 bg-white text-base ${
                validationErrors.username 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
            {validationErrors.username && (
              <div className="text-red-500 text-xs mt-1">{validationErrors.username}</div>
            )}
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
              className={`p-3 border-2 transition-all duration-200 bg-white text-base ${
                validationErrors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
            {validationErrors.password && (
              <div className="text-red-500 text-xs mt-1">{validationErrors.password}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="font-medium text-gray-700 mb-2 text-sm tracking-wider">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder=""
              required
              disabled={isLoading}
              className={`p-3 border-2 transition-all duration-200 bg-white text-base ${
                validationErrors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''} placeholder-gray-400`}
            />
            {validationErrors.confirmPassword && (
              <div className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black text-white py-4 px-6 font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 mt-2 w-full tracking-wider text-base ${
              isLoading 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
            }`}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
            )}
            {isLoading ? 'Creating Account...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
