"use client";

import React from 'react';

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Skeleton Image */}
      <div className="relative w-full aspect-[4/5] mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-200">
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full" />
        <div className="absolute inset-0 w-full h-full bg-gray-300" />
      </div>
      
      {/* Skeleton Info */}
      <div className="space-y-1.5 sm:space-y-2 px-1">
        <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-1/2" />
        <div className="flex items-center gap-2 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>
    </div>
  );
};
