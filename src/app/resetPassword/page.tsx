"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api/authApi';
import { useToast } from '@/providers/ToastProvider';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showError('Invalid or expired reset token.');
      return;
    }

    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      setIsSuccess(true);
      showSuccess('Password reset successfully! Please log in with your new password.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password. The link may have expired.';
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="py-8 px-4 flex items-center justify-center bg-white min-h-[calc(100vh-80px)]">
        <div className="bg-white w-full max-w-[430px] text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ✕
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">INVALID RESET LINK</h2>
          <p className="text-gray-600 text-sm mb-6">
            The password reset link is missing a valid security token or has expired.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors text-sm uppercase"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 flex items-center justify-center bg-white min-h-[calc(100vh-80px)]">
      <div className="bg-white w-full max-w-[430px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 tracking-wider uppercase">
            RESET PASSWORD
          </h2>
          <p className="text-gray-600 text-sm text-center">
            Please enter a new password for your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ✓
            </div>
            <h3 className="font-semibold text-green-900 mb-2">PASSWORD RESET SUCCESSFUL</h3>
            <p className="text-sm text-green-700 mb-6">
              Your new password has been updated. Redirecting you to the login page...
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-black text-white py-3 px-6 rounded font-medium hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <label
                htmlFor="newPassword"
                className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider uppercase"
              >
                NEW PASSWORD
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                disabled={isLoading}
                className="px-4 py-3 h-[44px] w-full border-2 border-gray-300 rounded text-black focus:border-black focus:outline-none transition-all text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="font-medium text-black mb-2 text-xs sm:text-sm tracking-wider uppercase"
              >
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                disabled={isLoading}
                className="px-4 py-3 h-[44px] w-full border-2 border-gray-300 rounded text-black focus:border-black focus:outline-none transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className={`bg-black text-white py-4 px-6 h-[48px] w-full font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 tracking-wider rounded uppercase text-sm ${
                isLoading || !newPassword || !confirmPassword ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
              )}
              UPDATE PASSWORD
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
