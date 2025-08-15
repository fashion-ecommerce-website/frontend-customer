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
      className={`group cursor-pointer ${className}`}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-3">
        <div className="aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product';
            }}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              SALE
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium">
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Brand */}
        <div className="text-sm text-gray-500 font-medium">
          {product.brand}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border border-gray-300 ${
                  color === 'black' ? 'bg-black' :
                  color === 'white' ? 'bg-white' :
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'green' ? 'bg-green-500' :
                  color === 'beige' ? 'bg-yellow-100' :
                  color === 'brown' ? 'bg-yellow-800' :
                  'bg-gray-400'
                }`}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(product.rating!) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {product.reviewCount && (
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
