'use client';

// Home Container Component
// Business logic container for home page

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomePresenter } from '../components/HomePresenter';
import { HomeCallState } from '../states/HomeCallState';
import { HomeContainerProps } from '../types/home.types';

export const HomeContainer: React.FC<HomeContainerProps> = ({
  className,
}) => {
  const router = useRouter();

  // Handle product click
  const handleProductClick = useCallback((productId: string) => {
    // Navigate to product detail page
    router.push(`/products/${productId}`);
  }, [router]);

  // Handle category click
  const handleCategoryClick = useCallback((categoryId: string) => {
    // Navigate to category page
    router.push(`/category/${categoryId}`);
  }, [router]);

  // Handle banner click
  const handleBannerClick = useCallback((bannerId: string, banners: Array<{ id: string; link?: string }>) => {
    // Navigate based on banner link
    const banner = banners.find(b => b.id === bannerId);
    if (banner?.link) {
      router.push(banner.link);
    }
  }, [router]);

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

          return (
            <HomePresenter
              banners={banners}
              newArrivals={newArrivals}
              recommendedProducts={recommendedProducts}
              productCategories={productCategories}
              isLoading={isLoading}
              error={error}
              onProductClick={(productId: string) => {
                selectProduct(productId);
                handleProductClick(productId);
              }}
              onCategoryClick={(categoryId: string) => {
                selectCategory(categoryId);
                handleCategoryClick(categoryId);
              }}
              onBannerClick={(bannerId: string) => {
                selectBanner(bannerId);
                handleBannerClick(bannerId, banners);
              }}
              onClearError={clearError}
            />
          );
        }}
      </HomeCallState>
    </div>
  );
};
