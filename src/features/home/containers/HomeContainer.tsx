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
  onNavigationChange,
  onSearch,
}) => {
  const router = useRouter();

  // Navigation handler
  const handleNavigationItemClick = useCallback((itemId: string) => {
    // Call external navigation change handler if provided
    if (onNavigationChange) {
      onNavigationChange(itemId);
    }

    // Handle navigation based on item ID
    switch (itemId) {
      case 'shop':
        router.push('/shop');
        break;
      case 'on-sale':
        router.push('/sale');
        break;
      case 'new-arrivals':
        router.push('/new-arrivals');
        break;
      default:
        console.log(`Navigation to ${itemId} not implemented yet`);
    }
  }, [onNavigationChange, router]);

  // Search handlers
  const handleSearchChange = useCallback((query: string) => {
    // Call external search handler if provided
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  const handleSearchSubmit = useCallback((query: string) => {
    // Navigate to search results page
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [router]);

  const handleSearchClear = useCallback(() => {
    // Clear search and call external handler
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <div className={className}>
      <HomeCallState>
        {({
          navigation,
          search,
          footer,
          banners,
          newArrivals,
          recommendedProducts,
          productCategories,
          isLoading,
          error,
          setActiveNavigation,
          toggleMenu,
          updateSearch,
          submitSearch,
          clearSearch,
          clearError,
          initializeHome,
          selectProduct,
          selectCategory,
          selectBanner
        }) => {
          // Handle menu toggle
          const handleMenuToggle = useCallback(() => {
            toggleMenu();
          }, [toggleMenu]);

          // Handle navigation item click with state update
          const handleNavigationClick = useCallback((itemId: string) => {
            setActiveNavigation(itemId);
            handleNavigationItemClick(itemId);
          }, [setActiveNavigation, handleNavigationItemClick]);

          // Handle search change with state update
          const handleSearchChangeWithState = useCallback((query: string) => {
            updateSearch(query);
            handleSearchChange(query);
          }, [updateSearch, handleSearchChange]);

          // Handle search submit with state update
          const handleSearchSubmitWithState = useCallback((query: string) => {
            submitSearch({ query });
            handleSearchSubmit(query);
          }, [submitSearch, handleSearchSubmit]);

          // Handle search clear with state update
          const handleSearchClearWithState = useCallback(() => {
            clearSearch();
            handleSearchClear();
          }, [clearSearch, handleSearchClear]);

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
              navigation={navigation}
              search={search}
              footer={footer}
              banners={banners}
              newArrivals={newArrivals}
              recommendedProducts={recommendedProducts}
              productCategories={productCategories}
              isLoading={isLoading}
              error={error}
              onNavigationItemClick={handleNavigationClick}
              onMenuToggle={handleMenuToggle}
              onSearchChange={handleSearchChangeWithState}
              onSearchSubmit={handleSearchSubmitWithState}
              onSearchClear={handleSearchClearWithState}
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
