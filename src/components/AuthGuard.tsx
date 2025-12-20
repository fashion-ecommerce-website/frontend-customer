/**
 * AuthGuard Component
 * Protects routes that require authentication and handles token refresh
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';
import { authUtils } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthentication = async () => {
    try {
      const accessToken = authUtils.getAccessToken();
      const refreshToken = authUtils.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if access token is expired
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const exp = payload.exp;
          const now = Math.floor(Date.now() / 1000);
          
          if (exp > now) {
            // Token is still valid
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch {
          // Error decoding token, continue to refresh
        }
      }

      // If access token is expired but we have refresh token, try to refresh
      if (refreshToken) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            authUtils.setTokens(data.accessToken, data.refreshToken || '');
            setIsAuthenticated(true);
          } else {
            authUtils.clearAuth();
            setIsAuthenticated(false);
          }
        } catch {
          authUtils.clearAuth();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading) {
      // Store error message in sessionStorage before redirect
      sessionStorage.setItem('authError', "You don't have permission to access this page.");
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
