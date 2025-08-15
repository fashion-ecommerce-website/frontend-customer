'use client';

import React from 'react';
import { Product } from '../types/home.types';

interface RecentlyViewedProps {
  products: Product[];
  onProductClick: (productId: string) => void;
  onEdit?: () => void;
  onDeleteAll?: () => void;
  className?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  products,
  onProductClick,
  onEdit,
  onDeleteAll,
  className = ''
}) => {
  if (!products || products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscount = (originalPrice?: number, currentPrice?: number) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <section className={`mb-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Có {products.length} sản phẩm đã xem
        </h2>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm lg:text-base transition-colors underline"
            >
              Edit
            </button>
          )}
          {onDeleteAll && (
            <button 
              onClick={onDeleteAll}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm lg:text-base transition-colors underline"
            >
              Delete all
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => {
          const discount = calculateDiscount(product.originalPrice, product.price);
          
          return (
            <div 
              key={product.id}
              className="group cursor-pointer"
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
                      e.currentTarget.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Product';
                    }}
                  />
                </div>
                
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium">
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1">
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
                    <span className="text-xs text-gray-500">
                      {product.rating}/5
                    </span>
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
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
