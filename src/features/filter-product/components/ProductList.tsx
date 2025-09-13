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
      {products.map((product) => {
        const firstImage = product.imageUrls?.[0] ?? '';
        const secondImage = product.imageUrls?.[1] ?? null;

        return (
        <div
          key={product.detailId}
          className="group cursor-pointer"
          onClick={() => onProductClick(product.productSlug)}
        >
          {/* Product Image */}
          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
            {firstImage ? (
              <>
                {/* base image */}
                <div
                  className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${firstImage})` }}
                />

                {/* hover: show next image with fade only */}
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
          <div className="space-y-2">
            <h3 className="font-medium text-black text-sm line-clamp-2 group-hover:text-gray-600 transition-colors">
              {product.productTitle}
            </h3>
            
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-black">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Available colors */}
            <div className="flex items-center gap-1">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    color === 'black' ? 'bg-black' :
                    color === 'white' ? 'bg-white border border-black' :
                    color === 'red' ? 'bg-red-500' :
                    color === 'blue' || color === 'dark blue' ? 'bg-blue-500' :
                    color === 'mint' ? 'bg-green-300' :
                    color === 'brown' ? 'bg-amber-700' :
                    color === 'yellow' ? 'bg-yellow-400' :
                    color === 'pink' ? 'bg-pink-400' :
                    'bg-gray-400'
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};
