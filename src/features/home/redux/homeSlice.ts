// Home Redux Slice
// State management for home page functionality

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import {
  HomeState,
  NavigationItem,
  FooterData,
  ApiError,
  SearchRequest,
  Banner,
  Product,
  ProductCategory
} from '../types/home.types';
import {
  mockBanners,
  mockNewArrivals,
  mockRecommendedProducts,
  mockProductCategories
} from '../data/mockData';

// Initial state
const initialState: HomeState = {
  navigation: {
    items: [
      {
        id: 'shop',
        label: 'Shop',
        href: '/shop',
        isActive: false,
        hasDropdown: true,
        dropdownItems: [
          { id: 'women', label: 'Women', href: '/shop/women' },
          { id: 'men', label: 'Men', href: '/shop/men' },
          { id: 'accessories', label: 'Accessories', href: '/shop/accessories' },
        ]
      },
      {
        id: 'on-sale',
        label: 'On Sale',
        href: '/sale',
        isActive: false,
      },
      {
        id: 'new-arrivals',
        label: 'New Arrivals',
        href: '/new-arrivals',
        isActive: false,
      },
    ],
    activeItem: null,
    isMenuOpen: false,
  },
  search: {
    query: '',
    isSearching: false,
    suggestions: [],
    recentSearches: [],
  },
  footer: {
    sections: [
      {
        id: 'help',
        title: 'HELP',
        links: [
          { id: 'customer-support', label: 'Customer Support', href: '/help/support' },
          { id: 'delivery-details', label: 'Delivery Details', href: '/help/delivery' },
          { id: 'terms-conditions', label: 'Terms & Conditions', href: '/help/terms' },
          { id: 'privacy-policy', label: 'Privacy Policy', href: '/help/privacy' },
        ]
      },
      {
        id: 'faq',
        title: 'FAQ',
        links: [
          { id: 'account', label: 'Account', href: '/faq/account' },
          { id: 'manage-deliveries', label: 'Manage Deliveries', href: '/faq/deliveries' },
          { id: 'orders', label: 'Orders', href: '/faq/orders' },
          { id: 'payments', label: 'Payments', href: '/faq/payments' },
        ]
      }
    ],
    socialLinks: [
      { id: 'twitter', platform: 'Twitter', href: '#', icon: 'twitter' },
      { id: 'facebook', platform: 'Facebook', href: '#', icon: 'facebook' },
      { id: 'instagram', platform: 'Instagram', href: '#', icon: 'instagram' },
      { id: 'pinterest', platform: 'Pinterest', href: '#', icon: 'pinterest' },
    ],
    paymentMethods: [
      { id: 'visa', name: 'Visa', icon: 'visa' },
      { id: 'mastercard', name: 'Mastercard', icon: 'mastercard' },
      { id: 'paypal', name: 'PayPal', icon: 'paypal' },
      { id: 'apple-pay', name: 'Apple Pay', icon: 'apple-pay' },
      { id: 'google-pay', name: 'Google Pay', icon: 'google-pay' },
    ],
    companyInfo: {
      name: 'FIT',
      description: 'We have clothes that suits your style and which you\'re proud to wear. From women to men.',
      copyright: 'FIT © 2025, All Rights Reserved',
    }
  },
  banners: mockBanners,
  newArrivals: mockNewArrivals,
  recommendedProducts: mockRecommendedProducts,
  productCategories: mockProductCategories,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Home slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // Navigation actions
    setActiveNavigation: (state, action: PayloadAction<string>) => {
      state.navigation.activeItem = action.payload;
      state.navigation.items = state.navigation.items.map(item => ({
        ...item,
        isActive: item.id === action.payload
      }));
    },

    toggleMenu: (state) => {
      state.navigation.isMenuOpen = !state.navigation.isMenuOpen;
    },

    closeMenu: (state) => {
      state.navigation.isMenuOpen = false;
    },

    // Search actions
    updateSearch: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },

    setSearching: (state, action: PayloadAction<boolean>) => {
      state.search.isSearching = action.payload;
    },

    submitSearch: (state, action: PayloadAction<SearchRequest>) => {
      state.search.isSearching = true;
      // Add to recent searches if not empty and not already present
      if (action.payload.query && !state.search.recentSearches.includes(action.payload.query)) {
        state.search.recentSearches.unshift(action.payload.query);
        // Keep only last 5 searches
        state.search.recentSearches = state.search.recentSearches.slice(0, 5);
      }
    },

    submitSearchSuccess: (state, action: PayloadAction<string[]>) => {
      state.search.isSearching = false;
      state.search.suggestions = action.payload;
    },

    submitSearchFailure: (state, action: PayloadAction<ApiError>) => {
      state.search.isSearching = false;
      state.error = action.payload.message;
    },

    clearSearch: (state) => {
      state.search.query = '';
      state.search.suggestions = [];
    },

    // General actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Initialize home - No loading needed for mock data
    initializeHome: (state) => {
      state.error = null;
      // state.isLoading = true; // Comment out to prevent unnecessary loading
      // Since we have mock data, set isInitialized immediately
      state.isInitialized = true;
    },

    initializeHomeSuccess: (state, action: PayloadAction<{ navigation: NavigationItem[], footer: FooterData }>) => {
      state.isLoading = false;
      state.navigation.items = action.payload.navigation;
      state.footer = action.payload.footer;
      state.isInitialized = true;
    },

    initializeHomeFailure: (state, action: PayloadAction<ApiError>) => {
      state.isLoading = false;
      state.error = action.payload.message;
      state.isInitialized = false;
    },

    // Product and Banner actions
    selectProduct: (state, action: PayloadAction<string>) => {
      // Handle product selection - could navigate to product detail page
      console.log('Product selected:', action.payload);
    },

    selectCategory: (state, action: PayloadAction<string>) => {
      // Handle category selection - could filter products or navigate to category page
      console.log('Category selected:', action.payload);
    },

    selectBanner: (state, action: PayloadAction<string>) => {
      // Handle banner click - could navigate to promotion page
      console.log('Banner selected:', action.payload);
    },

    // Reset state
    resetHomeState: () => initialState,
  },
});

// Export actions
export const {
  setActiveNavigation,
  toggleMenu,
  closeMenu,
  updateSearch,
  setSearching,
  submitSearch,
  submitSearchSuccess,
  submitSearchFailure,
  clearSearch,
  setLoading,
  setError,
  clearError,
  initializeHome,
  initializeHomeSuccess,
  initializeHomeFailure,
  selectProduct,
  selectCategory,
  selectBanner,
  resetHomeState,
} = homeSlice.actions;

// Action creators object for easier import
export const homeActionCreators = homeSlice.actions;

// Selectors
export const selectHomeState = (state: RootState) => state.home;
export const selectNavigation = (state: RootState) => state.home.navigation;
export const selectSearch = (state: RootState) => state.home.search;
export const selectFooter = (state: RootState) => state.home.footer;
export const selectBanners = (state: RootState) => state.home.banners;
export const selectNewArrivals = (state: RootState) => state.home.newArrivals;
export const selectRecommendedProducts = (state: RootState) => state.home.recommendedProducts;
export const selectProductCategories = (state: RootState) => state.home.productCategories;
export const selectIsLoading = (state: RootState) => state.home.isLoading;
export const selectError = (state: RootState) => state.home.error;
export const selectIsInitialized = (state: RootState) => state.home.isInitialized;

// Export reducer
export const homeReducer = homeSlice.reducer;
export default homeSlice.reducer;
