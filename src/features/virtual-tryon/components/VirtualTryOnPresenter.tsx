"use client";

import React from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VirtualTryOnPresenterProps } from "../types";
import { ImageUpload } from "./ImageUpload";
import { ProductSelector } from "./ProductSelector";
import { TryOnResult } from "./TryOnResult";

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

  const canTryOn: boolean = !!(
    userImage &&
    selectedProduct &&
    !isProcessing &&
    !resultImage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        {/* Status bar (top-right) */}
        <div className="absolute right-4 top-6 hidden sm:flex items-center">
          {isProcessing ? (
            <div className="inline-flex items-center gap-3 bg-yellow-50 text-yellow-800 px-3 py-2 rounded-full border border-yellow-100 shadow-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          ) : resultImage ? (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-full border border-green-100 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-full border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-gray-400 block" />
              <span className="text-sm">Idle</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!resultImage ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              style={{ minHeight: "36rem" }}
            >
              {/* Left Column - Product Selection */}
              <div className="space-y-6 h-full">
                <div className="bg-white  p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        selectedProduct
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {selectedProduct ? "✓" : "1"}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Select Your Item
                    </h2>
                  </div>

                  <div className="flex-1 overflow-auto mt-2">
                    <ProductSelector
                      products={products}
                      selectedProduct={selectedProduct}
                      onProductSelect={onProductSelect}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload & Try On */}
              <div className="h-full flex flex-col space-y-6">
                <div className="flex flex-col h-full bg-white  p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        userImage
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {userImage ? "✓" : "2"}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Upload Your Photo
                    </h2>
                  </div>

                  <ImageUpload
                    onImageUpload={onImageUpload}
                    userImage={userImage}
                    disabled={isProcessing}
                    onTryOn={onTryOn}
                    canTryOn={canTryOn}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Result View - Full Width */
            <div className="bg-white">
              <TryOnResult
                resultImage={resultImage}
                isProcessing={isProcessing}
                onReset={onReset}
                selectedProduct={selectedProduct}
                userImage={userImage}
              />
            </div>
          )}
        </div>

        {/* Tips Section */}
        {!resultImage && (
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                💡 Pro Tips for Amazing Results
              </h3>
              <p className="text-gray-600">
                Follow these tips to get the best virtual try-on experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Good Lighting
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use bright, even lighting for clear photos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Full Body Shot
                  </h4>
                  <p className="text-sm text-gray-600">
                    Include your full upper body for best results
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Neutral Background
                  </h4>
                  <p className="text-sm text-gray-600">
                    Plain backgrounds work better than busy ones
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    High Quality Photos
                  </h4>
                  <p className="text-sm text-gray-600">
                    Clear, high-resolution images give better results
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
