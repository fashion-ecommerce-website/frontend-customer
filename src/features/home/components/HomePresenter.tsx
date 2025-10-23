'use client';

// Home Presenter Component
// Presentational component for home page UI

import React from 'react';
import { HomePresenterProps } from '../types/home.types';
import { Banner } from './Banner';
import { NewsletterSignup } from './NewsletterSignup';
import { ProductSection } from './ProductSection';
import { RankingSection } from './RankingSection';

export const HomePresenter: React.FC<HomePresenterProps> = ({
  banners,
  newArrivals,
  productCategories,
  isLoading,
  error,
  onClearError,
  onProductClick,
  onCategoryClick,
  onBannerClick,
}) => {

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 relative mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-lg">
          <span className="block sm:inline text-sm sm:text-base">{error}</span>
          <button
            onClick={onClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-red-100 rounded-r-lg transition-colors"
            aria-label="Dismiss error"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 px-4">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="w-full">
          {/* Banner Section */}
          <Banner
            banners={banners}
            onBannerClick={onBannerClick}
          />

          {/* Main sections with responsive padding */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            {/* New Arrivals Section */}
            <ProductSection
              title="New arrival"
              products={newArrivals}
              categories={productCategories}
              onProductClick={onProductClick}
              onCategoryClick={onCategoryClick}
              showCategories={true}
              variant="newArrivals"
              leftImageUrl="https://cdn.hstatic.net/files/200000642007/file/banner_phu_-_giay_dep_-675_x873_bdb081cf9da74f98a05c919d53ed843d.jpg"
              className="pt-12 sm:pt-16 lg:pt-20"
            />

            {/* Ranking Section */}
            <RankingSection />
          </div>

          {/* Newsletter (no horizontal padding) */}
          <NewsletterSignup onSubmit={(email) => console.log('subscribe', email)} />
        </div>
      )}
    </div>
  );
};
