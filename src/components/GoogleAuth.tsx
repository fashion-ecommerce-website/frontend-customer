"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { googleLoginRequest, selectIsAuthenticated, selectUser, selectIsLoading, selectIsGoogleLoading } from '../features/auth/login/redux/loginSlice';

interface GoogleAuthProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ 
  onSuccess, 
  onError
}) => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const googleLoading = useAppSelector(selectIsGoogleLoading);

  // Trigger onSuccess when auth state is ready
  useEffect(() => {
    if (isAuthenticated && user) {
      onSuccess?.(user);
    }
  }, [isAuthenticated, user, onSuccess]);

  const handleSignIn = async () => {
    try {
      dispatch(googleLoginRequest());
      if (user) {
        onSuccess?.(user);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      
      // Don't show error for user cancellation cases
      const isCancelledByUser = errorMessage.includes('đóng cửa sổ') || 
                               errorMessage.includes('bị hủy') || 
                               errorMessage.includes('cancelled') ||
                               errorMessage.includes('popup-closed-by-user');
      
      if (!isCancelledByUser) {
        onError?.(errorMessage);
      }
    }
  };

  const disabled = googleLoading;

  // Hiển thị nút đăng nhập
  return (
    <button 
      type="button" 
      onClick={handleSignIn}
      disabled={disabled}
      className="flex items-center justify-center gap-3 w-full h-[48px] px-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-in-out relative overflow-hidden"
    >
      {/* Base content: keep space even while loading */}
      <svg className={`w-5 h-5 ${googleLoading ? 'opacity-0' : ''}`} viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className={`text-gray-700 font-medium ${googleLoading ? 'opacity-0' : ''}`}>
        Login with Google
      </span>

      {/* Overlay loader */}
      {googleLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-bounce" style={{ animationDelay: '-0.32s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '-0.16s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05] animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '0.16s' }}></div>
          </div>
        </div>
      )}
    </button>
  );
};
