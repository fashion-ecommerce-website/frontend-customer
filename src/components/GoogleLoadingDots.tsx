/**
 * Google Loading Dots Component
 * Custom loading animation with Google colors using Tailwind CSS
 */

'use client';

import React from 'react';

interface GoogleLoadingDotsProps {
  size?: 'sm' | 'md';
}

export const GoogleLoadingDots: React.FC<GoogleLoadingDotsProps> = ({ size = 'md' }) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div className="flex space-x-1">
      <div className={`${dotSize} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '-0.32s' }}></div>
      <div className={`${dotSize} bg-red-500 rounded-full animate-bounce`} style={{ animationDelay: '-0.16s' }}></div>
      <div className={`${dotSize} bg-yellow-400 rounded-full animate-bounce`} style={{ animationDelay: '0s' }}></div>
      <div className={`${dotSize} bg-green-500 rounded-full animate-bounce`} style={{ animationDelay: '0.16s' }}></div>
    </div>
  );
};
