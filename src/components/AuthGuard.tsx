/**
 * AuthGuard Component
 * Protects routes that require authentication and handles token refresh
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';
import { authUtils } from '@/utils/auth';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectAccessToken } from '@/features/auth/login/redux/loginSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  
  // Use Redux auth state which is synchronized with cookies
  const isAuthenticatedFromRedux = useAppSelector(selectIsAuthenticated);
  const accessTokenFromRedux = useAppSelector(selectAccessToken);

  // Wait for Redux hydration and initial auth check
  useEffect(() => {
    // Small delay to allow Redux to hydrate from cookies
    const hydrateTimer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);

    return () => clearTimeout(hydrateTimer);
  }, []);

  // Perform authentication check after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const checkAndRefreshAuth = async () => {
      try {
        // First check: Do we have Redux state indicating authentication?
        if (isAuthenticatedFromRedux && accessTokenFromRedux) {
          // Verify token is not expired
          try {
            const payload = JSON.parse(atob(accessTokenFromRedux.split('.')[1]));
            const exp = payload.exp;
            const now = Math.floor(Date.now() / 1000);
            
            if (exp > now) {
              // Token is valid, we're authenticated
              setIsChecking(false);
              return;
            }
          } catch {
            // Token decode failed, try refresh
          }
        }

        // Second check: Do we have tokens in cookies (even if Redux isn't synced)?
        const cookieAccessToken = authUtils.getAccessToken();
        const cookieRefreshToken = authUtils.getRefreshToken();

        // No tokens at all - definitely not authenticated
        if (!cookieAccessToken && !cookieRefreshToken) {
          setIsChecking(false);
          return;
        }

        // Check if cookie access token is valid
        if (cookieAccessToken) {
          try {
            const payload = JSON.parse(atob(cookieAccessToken.split('.')[1]));
            const exp = payload.exp;
            const now = Math.floor(Date.now() / 1000);
            
            if (exp > now) {
              // Cookie token is valid
              setIsChecking(false);
              return;
            }
          } catch {
            // Continue to refresh attempt
          }
        }

        // Try to refresh token if we have a refresh token
        if (cookieRefreshToken) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken: cookieRefreshToken }),
            });

            if (response.ok) {
              const data = await response.json();
              authUtils.setTokens(data.accessToken, data.refreshToken || '');
              // Token refreshed successfully
              setIsChecking(false);
              return;
            } else {
              // Refresh failed, clear auth
              authUtils.clearAuth();
            }
          } catch {
            // Refresh failed, clear auth
            authUtils.clearAuth();
          }
        }
        
        setIsChecking(false);
      } catch {
        setIsChecking(false);
      }
    };

    checkAndRefreshAuth();
  }, [isHydrated, isAuthenticatedFromRedux, accessTokenFromRedux]);

  // Handle redirect after checks are complete
  useEffect(() => {
    if (!isHydrated || isChecking) return;

    // Final authentication check
    const cookieAccessToken = authUtils.getAccessToken();
    const hasValidAuth = (isAuthenticatedFromRedux || cookieAccessToken) && cookieAccessToken;
    
    if (!hasValidAuth) {
      // Not authenticated, redirect to login
      sessionStorage.setItem('authError', "You don't have permission to access this page.");
      router.push(redirectTo);
    }
  }, [isHydrated, isChecking, isAuthenticatedFromRedux, router, redirectTo]);

  // Show loading while hydrating or checking auth
  if (!isHydrated || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Final check before rendering children
  const cookieAccessToken = authUtils.getAccessToken();
  const hasValidAuth = (isAuthenticatedFromRedux || cookieAccessToken) && cookieAccessToken;

  if (!hasValidAuth) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
