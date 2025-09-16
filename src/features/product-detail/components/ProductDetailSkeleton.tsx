import React from 'react';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Side: Image Gallery Skeleton */}
          <div className="space-y-6">
            {/* Main Image Skeleton */}
            <div className="aspect-square bg-gray-200 rounded"></div>
            
            {/* Thumbnail Gallery Skeleton */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item}
                  className="w-16 h-16 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
            
            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex space-x-4 border-b">
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title & Price Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Color Options Skeleton */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item}
                    className="w-8 h-8 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Size Options Skeleton */}
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-12"></div>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div 
                    key={size}
                    className="h-12 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="h-12 bg-gray-200 rounded w-full"></div>

            {/* Additional Info Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}