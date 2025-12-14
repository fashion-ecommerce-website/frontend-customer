"use client";

import React, { useState } from 'react';
import { TryOnResultProps } from '../types';
import { ComparisonView } from './ComparisonView';

export const TryOnResult: React.FC<TryOnResultProps> = ({
  resultImage,
  isProcessing,
  onReset,
  selectedProduct,
  selectedLowerProduct,
  userImage
}) => {
  const [viewMode, setViewMode] = useState<'result' | 'comparison'>('result');

  const handleDownload = async () => {
    if (!resultImage) return;
    
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `virtual-try-on-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column - Result Display */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {viewMode === 'result' ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultImage}
                alt="Virtual try-on result"
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                AI Generated
              </div>
            </div>
          ) : (
            <div className="p-4">
              <ComparisonView
                beforeImage={userImage!}
                afterImage={resultImage}
              />
              <p className="text-center text-xs text-gray-400 mt-4 uppercase tracking-widest">
                Drag slider to compare
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Controls & Details */}
        <div className="flex flex-col space-y-8">
          
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-8">
            <div>
              <h2 className="text-2xl font-bold text-black mb-1">Your Look</h2>
              <p className="text-gray-500">Generated just for you</p>
            </div>
            
            <div className="bg-gray-100 p-1 rounded-lg inline-flex self-start sm:self-auto">
              <button
                onClick={() => setViewMode('result')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'result'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Result
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'comparison'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Compare
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-black uppercase tracking-widest">
              Items in this look
            </h3>
            
            <div className="space-y-4">
              {/* Upper Product */}
              {selectedProduct && (
                <div 
                  onClick={() => window.location.href = `/products/${selectedProduct.productDetailId}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-black transition-all cursor-pointer bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.productTitle}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black truncate group-hover:text-gray-700 transition-colors">
                      {selectedProduct.productTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">
                        {selectedProduct.colorName}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">
                        {selectedProduct.sizeName}
                      </span>
                    </div>
                    <p className="mt-2 font-bold text-black">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(selectedProduct.price)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Lower Product */}
              {selectedLowerProduct && (
                <div 
                  onClick={() => window.location.href = `/products/${selectedLowerProduct.productDetailId}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-black transition-all cursor-pointer bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedLowerProduct.imageUrl}
                    alt={selectedLowerProduct.productTitle}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black truncate group-hover:text-gray-700 transition-colors">
                      {selectedLowerProduct.productTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">
                        {selectedLowerProduct.colorName}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">
                        {selectedLowerProduct.sizeName}
                      </span>
                    </div>
                    <p className="mt-2 font-bold text-black">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(selectedLowerProduct.price)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onReset}
              className="px-6 py-3 border border-gray-200 text-black font-bold rounded-xl hover:bg-gray-50 hover:border-black transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Another
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
