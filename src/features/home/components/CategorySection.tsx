'use client';

import React from 'react';
import { ProductCategory } from '../types/home.types';

interface CategorySectionProps {
  categories: ProductCategory[];
  onCategoryClick: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onCategoryClick,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            Explore our curated collections designed for your unique style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="group cursor-pointer relative overflow-hidden rounded-lg aspect-[3/4]"
            >
              <img
                src={category.image || 'https://via.placeholder.com/400x600'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-serif font-bold tracking-wider uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {category.name}
                </h3>
                <span className="mt-4 px-6 py-2 border border-white text-sm font-medium uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  Explore
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
