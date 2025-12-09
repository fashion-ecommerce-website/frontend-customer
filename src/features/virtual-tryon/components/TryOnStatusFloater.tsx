"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useVirtualTryOn } from '../context/VirtualTryOnContext';

export const TryOnStatusFloater: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isProcessing, resultImage, setMinimized, dismissResult } = useVirtualTryOn();
  if (pathname === '/cart/virtual-tryon') {
    return null;
  }

  if (!isProcessing && !resultImage) {
    return null;
  }

  const handleClick = () => {
    router.push('/cart/virtual-tryon');
    setMinimized(false);
  };

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col items-end gap-2 animate-fade-in-up">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden cursor-pointer transition-transform hover:scale-105"
        onClick={handleClick}
      >
        <div className="p-4 flex items-center gap-4 min-w-[300px]">
          {/* Status Indicator */}
          <div className="relative">
            {isProcessing ? (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
              </div>
            ) : (
              <div className="relative w-12 h-12">
                <Image 
                  src={resultImage!} 
                  alt="Result" 
                  fill
                  className="rounded-lg object-cover bg-gray-100"
                />
              </div>
            )}
            {/* Status Badge */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
          </div>

          {/* Text Info */}
          <div className="flex-1">
            <h4 className="font-bold text-sm text-black">
              {isProcessing ? 'Creating Your Look...' : 'Try-On Complete!'}
            </h4>
            <p className="text-xs text-gray-500">
              {isProcessing ? 'You can keep browsing' : 'Click to view result'}
            </p>
          </div>

          {/* Close Button (only for result) */}
          {!isProcessing && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dismissResult();
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Progress Bar (Fake for processing) */}
        {isProcessing && (
          <div className="h-1 bg-gray-100 w-full">
            <div className="h-full bg-black animate-progress-indeterminate"></div>
          </div>
        )}
      </div>
    </div>
  );
};
