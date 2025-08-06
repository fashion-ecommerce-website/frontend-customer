'use client';

import React from 'react';
import { LoginPresenterProps } from '../types/login.types';
import styles from '../styles/login.module.scss';

export const LoginPresenter: React.FC<LoginPresenterProps> = ({
  user,
  isAuthenticated,
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

  // Show success state if authenticated
  if (isAuthenticated && user) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.header}>
            <h2 className={styles.successTitle}>Welcome Back!</h2>
            <p className={styles.successSubtitle}>You have successfully signed in.</p>
          </div>

          <div className={styles.successInfo}>
            <div className={styles.successIcon}>
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.successLabel}>Login Successful</div>
              <div className={styles.userDetails}>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className={styles.logoutButton}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sign In</h2>
          <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <div className={styles.errorContent}>
              <div className={styles.errorIcon}>
                <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={styles.errorText}>
                <div className={styles.errorTitle}>Error</div>
                <p className={styles.errorMessage}>{error.message}</p>
              </div>
              <button
                type="button"
                onClick={onClearError}
                className={styles.errorClose}
              >
                <svg className={styles.closeIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            <label htmlFor="rememberMe" className={styles.checkboxLabel}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading && (
              <div className={styles.spinner}></div>
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.demoNote}>
            Demo credentials: any email/password will work
          </p>
        </div>
      </div>
    </div>
  );
};
