'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

interface PromotionalBannerProps {
  isAuthenticated: boolean;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ 
  isAuthenticated
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { translations } = useLanguage();

  // Different messages for authenticated and non-authenticated users
  const guestMessages = [
    {
      text: translations.promotionalBanner.signUpDiscount,
      action: { text: translations.promotionalBanner.signUpAction, href: '/auth/register' }
    },
    {
      text: translations.promotionalBanner.freeShipping,
      action: null
    }
  ];

  const authenticatedMessages = [
    {
      text: translations.promotionalBanner.freeShipping,
      action: null
    },
    {
      text: translations.promotionalBanner.exclusiveDeals,
      action: null
    },
    {
      text: translations.promotionalBanner.easyReturns,
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
    <div className="bg-neutral-950 text-neutral-300 text-center py-2.5 px-4 border-b border-neutral-900 text-[11px] font-medium uppercase tracking-[0.2em]">
      <p className="inline-flex items-center justify-center gap-2">
        <span>{currentMessage.text}</span>
        {currentMessage.action && (
          <Link 
            href={currentMessage.action.href} 
            className="underline text-[#C5A880] hover:text-[#B89762] transition-colors font-semibold ml-1"
          >
            {currentMessage.action.text}
          </Link>
        )}
      </p>
    </div>
  );
};