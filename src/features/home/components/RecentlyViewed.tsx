'use client';

import React from 'react';
import { Product } from '../types/home.types';
import { ProductCard } from './ProductCard';

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

  return (
    <section className={`mb-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Có {products.length} sản phẩm đã xem
        </h2>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm lg:text-base transition-colors"
            >
              Edit
            </button>
          )}
          {onDeleteAll && (
            <button 
              onClick={onDeleteAll}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm lg:text-base transition-colors"
            >
              Delete all
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};
