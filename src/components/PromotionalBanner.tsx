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
      text: 'Sign up and get 20% off to your first order.',
      action: { text: 'Sign Up Now', href: '/auth/register' }
    },
    {
      text: 'Free shipping on orders over 500,000₫',
      action: null
    },
    {
      text: 'New arrivals every week - Stay updated!',
      action: { text: 'Shop Now', href: '/new-arrivals' }
    }
  ];

  const authenticatedMessages = [
    {
      text: 'Free shipping on orders over 500,000₫',
      action: null
    },
    {
      text: 'New arrivals every week - Check them out!',
      action: { text: 'Shop Now', href: '/new-arrivals' }
    },
    {
      text: 'Exclusive member deals available now',
      action: { text: 'View Deals', href: '/deals' }
    },
    {
      text: 'Easy returns within 30 days',
      action: null
    }
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