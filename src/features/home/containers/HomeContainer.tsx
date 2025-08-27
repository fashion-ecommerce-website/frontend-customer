'use client';

// Home Container Component
// Business logic container for home page

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomePresenter } from '../components/HomePresenter';
import { HomeCallState } from '../states/HomeCallState';
import { HomeContainerProps } from '../types/home.types';

export const HomeContainer: React.FC<HomeContainerProps> = ({
  className,
}) => {
  const router = useRouter();

  return (
    <div className={className}>
      <HomeCallState>
        {({
          banners,
          newArrivals,
          recommendedProducts,
          productCategories,
          isLoading,
          error,
          clearError,
          selectProduct,
          selectCategory,
          selectBanner
        }) => {
          // Handle product click
          const handleProductClick = useCallback((productId: string) => {
            selectProduct(productId);
            // Navigate to product detail page
            router.push(`/product/${productId}`);
          }, [selectProduct, router]);

          // Handle category click
          const handleCategoryClick = useCallback((categoryId: string) => {
            selectCategory(categoryId);
            // Navigate to category page
            router.push(`/category/${categoryId}`);
          }, [selectCategory, router]);

          // Handle banner click
          const handleBannerClick = useCallback((bannerId: string) => {
            selectBanner(bannerId);
            // Navigate based on banner link
            const banner = banners.find(b => b.id === bannerId);
            if (banner?.link) {
              router.push(banner.link);
            }
          }, [selectBanner, banners, router]);

          return (
            <HomePresenter
              banners={banners}
              newArrivals={newArrivals}
              recommendedProducts={recommendedProducts}
              productCategories={productCategories}
              isLoading={isLoading}
              error={error}
              onProductClick={handleProductClick}
              onCategoryClick={handleCategoryClick}
              onBannerClick={handleBannerClick}
              onClearError={clearError}
            />
          );
        }}
      </HomeCallState>
    </div>
  );
};
