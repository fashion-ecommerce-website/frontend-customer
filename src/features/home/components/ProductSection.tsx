'use client';

import React from 'react';
import { Product, ProductCategory } from '../types/home.types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  categories?: ProductCategory[];
  onProductClick: (productId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  showCategories?: boolean;
  className?: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  categories,
  onProductClick,
  onCategoryClick,
  showCategories = false,
  className = ''
}) => {
  return (
    <section className={`mb-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        
        {/* View All Link */}
        <button className="text-orange-600 hover:text-orange-700 font-medium text-sm lg:text-base transition-colors">
          Xem tất cả →
        </button>
      </div>

      {/* Category Filter */}
      {showCategories && categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${category.isActive 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
        </div>
      )}
    </section>
  );
};
