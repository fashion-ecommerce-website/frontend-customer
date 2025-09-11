'use client';

import React from 'react';
import { FilterProductItem } from '../types';

interface ProductListProps {
  products: FilterProductItem[];
  isLoading: boolean;
  onProductClick: (slug: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onProductClick
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.detailId}
          className="group cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => onProductClick(product.productSlug)}
        >
          {/* Product Image */}
          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
            <div
              className="w-full h-full transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundImage: `url(${product.imageUrls[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Color indicator */}
            <div className="absolute bottom-2 left-2">
              <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded">
                {product.colorName}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-black text-sm line-clamp-2 group-hover:text-gray-600 transition-colors">
              {product.productTitle}
            </h3>
            
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-black">
                {formatPrice(product.price)}
              </p>
              
              {product.quantity > 0 ? (
                <span className="text-xs text-black font-medium">
                  {product.quantity} items left
                </span>
              ) : (
                <span className="text-xs text-black font-medium">
                  Out of stock
                </span>
              )}
            </div>

            {/* Available colors */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border border-gray-300 ${
                    color === 'black' ? 'bg-black' :
                    color === 'white' ? 'bg-white' :
                    color === 'red' ? 'bg-red-500' :
                    color === 'blue' || color === 'dark blue' ? 'bg-blue-500' :
                    color === 'mint' ? 'bg-green-300' :
                    color === 'brown' ? 'bg-amber-700' :
                    color === 'yellow' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-black">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
