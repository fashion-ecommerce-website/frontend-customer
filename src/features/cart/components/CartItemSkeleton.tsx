"use client";

import React from "react";

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-start space-x-4 py-6 border-b border-gray-200 last:border-b-0 animate-pulse">
      {/* Image Skeleton with Checkbox */}
      <div className="flex-shrink-0 relative">
        <div className="w-30 h-37 bg-gray-200 rounded-lg"></div>
        {/* Checkbox Skeleton */}
        <div className="absolute top-0 left-0">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Product Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Color / Size */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        
        {/* Quantity */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        
        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-col items-end space-y-2">
        <div className="w-[80px] h-8 bg-gray-200 rounded"></div>
        <div className="w-[80px] h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
