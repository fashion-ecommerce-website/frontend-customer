"use client";

import React from 'react';
import { Product } from '@/types/product.types';
import AddToCartSvg from './AddToCartSvg';
import { useLanguage } from '@/hooks/useLanguage';
import { useColorMap } from '@/hooks/useColorMap';

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
  const { translations } = useLanguage();
  const rawFirstImage = product.images?.[0] || product.image;
  const secondImage = product.images?.[1] || null;
  const { getColorHex } = useColorMap();

  const fallbackImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';
  const [imgSrc, setImgSrc] = React.useState<string>(rawFirstImage || fallbackImage);

  React.useEffect(() => {
    setImgSrc(rawFirstImage || fallbackImage);
  }, [rawFirstImage]);

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ease-out bg-white p-1.5 sm:p-2 rounded-lg border border-neutral-200/70 shadow-2xs hover:shadow-lg hover:border-amber-300/80 ${className}`}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image + Quick View Icon */}
      <div className="relative w-full aspect-[4/5] mb-2 overflow-hidden rounded-md bg-neutral-50 flex-shrink-0">
        {/* Promotion Badge */}
        {product.percentOff && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-neutral-900/90 text-[#C5A880] text-[11px] font-bold tracking-wider rounded-md px-2 py-0.5 shadow-sm backdrop-blur-xs">
            -{product.percentOff}%
          </div>
        )}
        
        {/* Quick View Icon */}
        {onQuickView && (
          <button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 cursor-pointer active:scale-95"
            onClick={(e) => onQuickView(product, e)}
            aria-label={translations.product.quickView}
          >
            <div className="scale-90 sm:scale-100 drop-shadow-md p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-150">
              <AddToCartSvg />
            </div>
          </button>
        )}

        {imgSrc ? (
          <>
            {/* Base image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={product.name || 'Product'}
              onError={() => setImgSrc(fallbackImage)}
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Hover: show second image with fade */}
            {secondImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={secondImage}
                alt={product.name || 'Product hover'}
                onError={(e) => (e.currentTarget.style.display = 'none')}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 px-0.5 flex-shrink-0">
        <h3 className="font-medium text-neutral-800 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors min-h-[34px] sm:min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 pt-0.5">
          {product.finalPrice && product.finalPrice < product.price ? (
            <>
              <div className="text-sm sm:text-base font-bold text-amber-800">
                {product.finalPrice.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-xs line-through text-neutral-400">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
            </>
          ) : (
            <div className="text-sm sm:text-base font-bold text-neutral-900">
              {product.price.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>

        {/* Available colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-neutral-200 transition-transform hover:scale-125 shadow-xs"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] font-medium text-neutral-400 ml-0.5">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
