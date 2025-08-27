'use client';

import React from 'react';
import { Product } from '../types/home.types';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  className = '' 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`group cursor-pointer transition-transform duration-200 hover:scale-105 ${className}`}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
        <div 
          className="w-full h-full transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Heart Icon */}
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white">
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {product.brand}
        </p>
        
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color === 'white' ? '#ffffff' : 
                                  color === 'black' ? '#000000' :
                                  color === 'beige' ? '#F5F5DC' :
                                  color === 'navy' ? '#001f3f' :
                                  color === 'gray' ? '#808080' :
                                  color
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
