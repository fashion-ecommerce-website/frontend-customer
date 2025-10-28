"use client";

import React from 'react';
import { Product } from '@/types/product.types';
import AddToCartSvg from './AddToCartSvg';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  onQuickView?: (product: Product, e: React.MouseEvent) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  onQuickView,
  className = ''
}) => {
  const firstImage = product.images?.[0] || product.image;
  const secondImage = product.images?.[1] || null;

  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-[#f1f0eb]",
      red: "bg-[#6d2028]",
      gray: "bg-[#a7a9a8]",
      blue: "bg-[#acbdcd]",
      pink: "bg-[#ddb3bd]",
      yellow: "bg-[#dcbe9a]",
      purple: "bg-[#47458e]",
      brown: "bg-[#61493f]",
      green: "bg-[#2c5449]",
      beige: "bg-[#ebe7dc]",
      orange: "bg-[#F5B505]",
      navy: "bg-[#001f3f]"
    };
    return colorMap[color.toLowerCase()] || "bg-gray-400";
  };

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ease-out ${className}`}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image + Quick View Icon */}
      <div className="relative w-full aspect-[4/5] mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
        {/* Promotion Badge */}
        {product.percentOff && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold rounded shadow-lg w-10 h-6 flex items-center justify-center">
            -{product.percentOff}%
          </div>
        )}
        
        {/* Quick View Icon */}
        {onQuickView && (
          <button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => onQuickView(product, e)}
            aria-label="Quick view product"
          >
            <div className="scale-90 sm:scale-100 drop-shadow-lg">
              <AddToCartSvg />
            </div>
          </button>
        )}

        {firstImage ? (
          <>
            {/* Base image */}
            <div
              className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transform group-hover:scale-105 transition-transform duration-500 ease-out"
              style={{ backgroundImage: `url(${firstImage})` }}
            />

            {/* Hover: show second image with fade */}
            {secondImage && (
              <div
                className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100"
                style={{ backgroundImage: `url(${secondImage})` }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-1.5 px-0.5 sm:px-1 flex-shrink-0">
        <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base line-clamp-2 leading-snug group-hover:text-black transition-colors min-h-[36px] sm:min-h-[44px]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          {product.finalPrice && product.finalPrice < product.price ? (
            <>
              <div className="text-sm sm:text-base lg:text-lg font-bold text-red-600">
                {product.finalPrice.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-xs sm:text-sm line-through text-gray-500">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
            </>
          ) : (
            <div className="text-sm sm:text-base lg:text-lg font-bold text-black">
              {product.price.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>

        {/* Available colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getColorClass(color)} transition-transform hover:scale-110`}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
