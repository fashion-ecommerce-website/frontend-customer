"use client";

import React from 'react';
import { TryOnResultProps } from '../types';

export const TryOnResult: React.FC<TryOnResultProps> = ({
  resultImage,
  isProcessing,
  onReset
}) => {
  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-black animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-2">
            Creating Your Virtual Try-On...
          </p>
          <p className="text-gray-600 text-sm">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Virtual Try-On Result
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
        >
          Try Another
        </button>
      </div>
      
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultImage}
          alt="Virtual try-on result"
          className="w-full h-auto rounded-lg shadow-md"
        />
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Another Product
          </button>
          <button
            className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
};
