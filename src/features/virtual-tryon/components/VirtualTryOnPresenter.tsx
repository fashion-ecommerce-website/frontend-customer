"use client";

import React from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { VirtualTryOnPresenterProps } from '../types';
import { ImageUpload } from './ImageUpload';
import { ProductSelector } from './ProductSelector';
import { TryOnResult } from './TryOnResult';

export const VirtualTryOnPresenter: React.FC<VirtualTryOnPresenterProps> = ({
  products,
  selectedProduct,
  userImage,
  resultImage,
  isProcessing,
  error,
  onProductSelect,
  onImageUpload,
  onTryOn,
  onReset,
  onBack
}) => {
  const breadcrumbItems = [
    {
      label: "HOME",
      className: "text-gray-400 font-semibold font-[12px]",
      href: "/",
    },
    {
      label: "SHOPPING CART",
      className: "text-gray-400 font-semibold font-[12px]",
      href: "/cart",
    },
    {
      label: "VIRTUAL TRY-ON",
      className: "text-black font-semibold font-[12px]",
      href: "/cart/virtual-tryon",
    },
  ];

  const canTryOn = userImage && selectedProduct && !isProcessing && !resultImage;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Virtual Try-On
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  See how products from your cart look on you using AI
                </p>
              </div>
            </div>
            
            {/* AI Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-sm font-medium">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-lg">
            <span className="block text-sm">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Selection & Upload */}
          <div className="space-y-6">
            <ProductSelector
              products={products}
              selectedProduct={selectedProduct}
              onProductSelect={onProductSelect}
              disabled={isProcessing}
            />

            <ImageUpload
              onImageUpload={onImageUpload}
              userImage={userImage}
              disabled={isProcessing}
            />

            {/* Try-On Button */}
            {!resultImage && (
              <button
                onClick={onTryOn}
                disabled={!canTryOn}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                  canTryOn
                    ? 'bg-black hover:bg-gray-800 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Try On Now
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Right Column - Result Preview */}
          <div className="space-y-6">
            <TryOnResult
              resultImage={resultImage}
              isProcessing={isProcessing}
              onReset={onReset}
            />

            {!resultImage && !isProcessing && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center text-gray-500">
                  <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">
                    Select a product and upload your photo to see the result here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Use a clear, well-lit photo of yourself facing forward</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Avoid busy backgrounds for better accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Make sure your full upper body is visible in the photo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>The AI works best with clothing items like shirts, jackets, and dresses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
