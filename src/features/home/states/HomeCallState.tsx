'use client';

// Home Call State Component
// Connects Redux state to UI components for home feature

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectNavigation,
  selectSearch,
  selectFooter,
  selectBanners,
  selectNewArrivals,
  selectRecommendedProducts,
  selectProductCategories,
  selectIsLoading,
  selectError,
  selectIsInitialized,
  setActiveNavigation,
  toggleMenu,
  updateSearch,
  submitSearch,
  clearSearch,
  clearError,
  initializeHome,
  selectProduct,
  selectCategory,
  selectBanner,
} from '../redux/homeSlice';
import { HomeCallStateProps, SearchRequest } from '../types/home.types';

export const HomeCallState: React.FC<HomeCallStateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux store
  const navigation = useAppSelector(selectNavigation);
  const search = useAppSelector(selectSearch);
  const footer = useAppSelector(selectFooter);
  const banners = useAppSelector(selectBanners);
  const newArrivals = useAppSelector(selectNewArrivals);
  const recommendedProducts = useAppSelector(selectRecommendedProducts);
  const productCategories = useAppSelector(selectProductCategories);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isInitialized = useAppSelector(selectIsInitialized);

  // Action handlers
  const handleSetActiveNavigation = useCallback((itemId: string) => {
    dispatch(setActiveNavigation(itemId));
  }, [dispatch]);

  const handleToggleMenu = useCallback(() => {
    dispatch(toggleMenu());
  }, [dispatch]);

  const updateSearchQuery = useCallback((query: string) => {
    dispatch(updateSearch(query));
  }, [dispatch]);

  const submitSearchQuery = useCallback((query: string) => {
    const searchRequest: SearchRequest = {
      query: query.trim(),
    };
    dispatch(submitSearch(searchRequest));
  }, [dispatch]);

  const clearSearchQuery = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initializeHomePage = useCallback(() => {
    dispatch(initializeHome());
  }, [dispatch]);

  const handleProductSelect = useCallback((productId: string) => {
    dispatch(selectProduct(productId));
  }, [dispatch]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    dispatch(selectCategory(categoryId));
  }, [dispatch]);

  const handleBannerSelect = useCallback((bannerId: string) => {
    dispatch(selectBanner(bannerId));
  }, [dispatch]);

  // Initialize home page on mount if not already initialized
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeHomePage();
    }
  }, [isInitialized, isLoading, initializeHomePage]);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearErrorMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearErrorMessage]);

  return (
    <>
      {children({
        navigation,
        search,
        footer,
        banners,
        newArrivals,
        recommendedProducts,
        productCategories,
        isLoading,
        error,
        setActiveNavigation: handleSetActiveNavigation,
        toggleMenu: handleToggleMenu,
        updateSearch: updateSearchQuery,
        submitSearch: submitSearchQuery,
        clearSearch: clearSearchQuery,
        clearError: clearErrorMessage,
        initializeHome: initializeHomePage,
        selectProduct: handleProductSelect,
        selectCategory: handleCategorySelect,
        selectBanner: handleBannerSelect,
      })}
    </>
  );
};
