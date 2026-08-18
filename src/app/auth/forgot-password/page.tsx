"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/services/api/authApi';
import { useToast } from '@/providers/ToastProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setIsSuccess(true);
      showSuccess('Reset request sent! Please check your email inbox.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred, please try again';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 flex items-center justify-center bg-white min-h-[calc(100vh-80px)]">
      <div className="bg-white w-full max-w-[430px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 tracking-wider uppercase">
            FORGOT PASSWORD
          </h2>
          <p className="text-gray-600 text-sm text-center">
            Enter your account email. We will send a password reset link to your email address.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ✓
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Reset Link Sent</h3>
            <p className="text-sm text-green-700 mb-6">
              We have sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder).
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider uppercase"
              >
                ACCOUNT EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter.your.email@example.com"
                required
                disabled={isLoading}
                className="px-4 py-3 h-[44px] w-full border-2 border-gray-300 rounded text-black focus:border-black focus:outline-none transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className={`bg-black text-white py-4 px-6 h-[48px] w-full font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 tracking-wider rounded uppercase text-sm ${
                isLoading || !email.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
              )}
              SEND RESET LINK
            </button>

            <div className="text-center text-sm mt-4">
              <Link href="/auth/login" className="text-gray-900 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
