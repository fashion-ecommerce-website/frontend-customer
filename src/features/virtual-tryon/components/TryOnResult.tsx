"use client";

import React, { useState } from 'react';
import { TryOnResultProps } from '../types';

export const TryOnResult: React.FC<TryOnResultProps> = ({
  resultImage,
  isProcessing,
  onReset,
  selectedProduct,
  userImage
}) => {
  const [viewMode, setViewMode] = useState<'result' | 'comparison'>('result');

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Creating Your Virtual Look
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is working its magic to show you how this {selectedProduct?.productTitle.toLowerCase()} looks on you.
          This usually takes 30-60 seconds.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-pulse">●</div>
          <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</div>
          <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</div>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
          {/* Header removed - title moved to status bar in the top-right */}

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('result')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'result'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Result Only
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'comparison'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Before & After
          </button>
        </div>
      </div>

      {/* Result Display */}
      <div className="bg-white overflow-hidden">
        {viewMode === 'result' ? (
          <div className="p-6">
            <div className="relative max-w-md mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultImage}
                alt="Virtual try-on result"
                className="w-full h-auto rounded-xl shadow-md"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                AI Generated
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 text-center">Before</h3>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userImage!}
                    alt="Original photo"
                    className="w-full h-auto rounded-xl shadow-md"
                  />
                  <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    Your Photo
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 text-center">After</h3>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultImage}
                    alt="Virtual try-on result"
                    className="w-full h-auto rounded-xl shadow-md"
                  />
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Virtual Try-On
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      {selectedProduct && (
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.productTitle}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedProduct.productTitle}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                    {selectedProduct.colorName}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                    {selectedProduct.sizeName}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(selectedProduct.price)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 border border-gray-300 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Item
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share Result
        </button>
        <button
          className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Save to Try On History
        </button>
      </div>
    </div>
  );
};
