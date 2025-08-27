'use client';

// Home Presenter Component
// Presentational component for home page UI

import React, { useState } from 'react';
import { HomePresenterProps } from '../types/home.types';
import { Banner } from './Banner';
import { ProductSection } from './ProductSection';
import { RecentlyViewed } from './RecentlyViewed';
import { mockRecentlyViewed } from '../data/mockData';

export const HomePresenter: React.FC<HomePresenterProps> = ({
  banners,
  newArrivals,
  recommendedProducts,
  productCategories,
  isLoading,
  error,
  onClearError,
  onProductClick,
  onCategoryClick,
  onBannerClick,
}) => {

  return (
    <div className="bg-white">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={onClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Section */}
          <Banner
            banners={banners}
            onBannerClick={onBannerClick}
          />

          {/* New Arrivals Section */}
          <ProductSection
            title="New arrival"
            products={newArrivals}
            categories={productCategories}
            onProductClick={onProductClick}
            onCategoryClick={onCategoryClick}
            showCategories={true}
          />

          {/* Recommended Products Section */}
          <ProductSection
            title="PRODUCT YOU MIGHT LIKE"
            products={recommendedProducts}
            onProductClick={onProductClick}
          />

          {/* Recently Viewed Section */}
          <RecentlyViewed
            products={mockRecentlyViewed}
            onProductClick={onProductClick}
            onEdit={() => console.log('Edit recently viewed')}
            onDeleteAll={() => console.log('Delete all recently viewed')}
          />
        </div>
      )}
    </div>
  );
};
