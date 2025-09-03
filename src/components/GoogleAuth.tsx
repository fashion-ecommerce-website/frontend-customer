'use client';

import Image from 'next/image';
import { useGoogleAuthState } from '../hooks/useGoogleAuthState';
import { BackendUser } from '../services/api/authApi';

interface GoogleAuthProps {
  onSuccess?: (user: BackendUser) => void;
  onError?: (error: string) => void;
  showFullStatus?: boolean; // Hiển thị thông tin đầy đủ của user khi đã đăng nhập
  hideLoginButton?: boolean; // Ẩn button đăng nhập khi chưa đăng nhập (chỉ hiển thị text)
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ 
  onSuccess, 
  onError,
  showFullStatus = false,
  hideLoginButton = false
}) => {
  const { user, isAuthenticated, loading, error, signInWithGoogle, signOut } = useGoogleAuthState();

  const handleSignIn = async () => {
    try {
      const backendUser = await signInWithGoogle();
      onSuccess?.(backendUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      // Don't show generic error if user just cancelled
      if (!errorMessage.includes('bị hủy') && !errorMessage.includes('cancelled')) {
        onError?.(errorMessage);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng xuất thất bại';
      onError?.(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: '#4285F4',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '-0.32s'
            }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: '#EA4335',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '-0.16s'
            }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: '#FBBC05',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: '#34A853',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0.16s'
            }}
          ></div>
        </div>
        <span className="text-gray-600 font-medium">Đang xử lý...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Lỗi: {error}
      </div>
    );
  }

  // Nếu đã đăng nhập
  if (isAuthenticated && user) {
    if (showFullStatus) {
      // Hiển thị thông tin đầy đủ (dùng cho trang profile hoặc header)
      return (
        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
          {user.picture && (
            <Image 
              src={user.picture} 
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="text-sm font-medium text-green-800">
              Chào {user.name}!
            </div>
            <div className="text-xs text-green-600">
              {user.email}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="text-xs text-green-700 hover:text-green-900 underline disabled:opacity-50"
          >
            Đăng xuất
          </button>
        </div>
      );
    } else {
      // Hiển thị đơn giản (chỉ nút đăng xuất)
      return (
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
          ) : (
            user.picture && (
              <Image 
                src={user.picture} 
                alt={user.name}
                width={16}
                height={16}
                className="rounded-full"
              />
            )
          )}
          <span>Đăng xuất</span>
        </button>
      );
    }
  }

  // Nếu chưa đăng nhập
  if (hideLoginButton) {
    // Chỉ hiển thị text thông báo, không hiển thị button đăng nhập
    return (
      <div className="text-gray-600 text-sm">
        Chưa đăng nhập
      </div>
    );
  }

  // Hiển thị nút đăng nhập
  return (
    <button 
      type="button" 
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 transition-all duration-300 ease-in-out relative overflow-hidden"
    >
      {loading ? (
        <div className="flex space-x-1">
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: '#4285F4',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '-0.32s'
            }}
          ></div>
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: '#EA4335',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '-0.16s'
            }}
          ></div>
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: '#FBBC05',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: '#34A853',
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0.16s'
            }}
          ></div>
        </div>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      <span className="text-gray-700 font-medium">
        {loading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
      </span>
    </button>
  );
};
