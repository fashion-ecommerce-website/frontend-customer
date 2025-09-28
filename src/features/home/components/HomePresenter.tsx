'use client';

// Home Presenter Component
// Presentational component for home page UI

import React, { useState } from 'react';
import { HomePresenterProps } from '../types/home.types';
import { Banner } from './Banner';
import { NewsletterSignup } from './NewsletterSignup';
import { ProductSection } from './ProductSection';

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
    <div className="bg-white overflow-x-hidden">
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
        <div className="w-full px-0 py-0">
          {/* Banner Section */}
          <Banner
            banners={banners}
            onBannerClick={onBannerClick}
          />

          {/* Main sections with 48px horizontal padding (exclude banner/newsletter) */}
          <div className="px-12">
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
              className="pt-20"
            />

            {/* Ranking Section */}
            <ProductSection
              title="RANKING"
              products={recommendedProducts}
              onProductClick={onProductClick}
              onCategoryClick={onCategoryClick}
              categories={productCategories}
              showCategories={true}
              variant="ranking"
              className="pt-20"
            />

          </div>

          {/* Newsletter (no padding) */}
          <NewsletterSignup onSubmit={(email) => console.log('subscribe', email)} />
        </div>
      )}
    </div>
  );
};
