'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PromotionalBannerProps {
  isAuthenticated: boolean;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ 
  isAuthenticated
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Different messages for authenticated and non-authenticated users
  const guestMessages = [
    {
      text: 'Đăng ký để khám phá thời trang cá nhân hóa.',
      action: { text: 'Đăng Ký Ngay', href: '/auth/register' }
    },
    {
      text: 'Thử đồ ảo - Xem trước outfit trước khi mua',
      action: null
    }
  ];

  const authenticatedMessages = [
    {
      text: 'Sản phẩm mới - Khám phá ngay!',
      action: null
    },
    {
      text: 'Ưu đãi độc quyền dành cho thành viên',
      action: null
    },
  ];

  const messages = isAuthenticated ? authenticatedMessages : guestMessages;

  // Auto-slide messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  // Reset index when message list length changes (e.g., after logout)
  useEffect(() => {
    setCurrentMessageIndex(0);
  }, [messages.length]);

  const currentMessage = messages[currentMessageIndex] ?? messages[0];

  return (
    <div className="bg-black text-white text-center py-3 px-4 relative">
      <p className="font-bold text-sm">
        {currentMessage.text}{' '}
        {currentMessage.action && (
          <Link 
            href={currentMessage.action.href} 
            className="underline font-medium hover:text-gray-200 transition-colors"
          >
            {currentMessage.action.text}
          </Link>
        )}
      </p>
    </div>
  );
};