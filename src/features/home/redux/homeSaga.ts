// Home Redux Saga
// Side effects management for home page functionality

import { call, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  initializeHome,
  initializeHomeSuccess,
  initializeHomeFailure,
  submitSearch,
  submitSearchSuccess,
  submitSearchFailure,
  setSearching,
} from './homeSlice';
import { 
  SearchRequest, 
  NavigationItem, 
  FooterData, 
  ApiError 
} from '../types/home.types';

// Mock API functions (replace with real API calls)
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

const mockInitializeHomeApi = async (): Promise<{ navigation: NavigationItem[], footer: FooterData }> => {
  await mockApiDelay();
  
  // Return mock data - in real app this would come from API
  return {
    navigation: [
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
    }
  };
};

const mockSearchApi = async (request: SearchRequest): Promise<string[]> => {
  await mockApiDelay();
  
  // Mock search suggestions based on query
  const mockSuggestions = [
    'dress', 'shirt', 'pants', 'shoes', 'jacket', 'skirt', 'blouse', 'jeans',
    'sweater', 'coat', 'boots', 'sneakers', 'accessories', 'bag', 'hat'
  ];
  
  if (!request.query) {
    return [];
  }
  
  return mockSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(request.query.toLowerCase())
  ).slice(0, 5);
};

// Saga workers
function* initializeHomeSaga() {
  try {
    const data: { navigation: NavigationItem[], footer: FooterData } = yield call(mockInitializeHomeApi);
    yield put(initializeHomeSuccess(data));
  } catch (error) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to initialize home page',
      code: 'INIT_ERROR'
    };
    yield put(initializeHomeFailure(apiError));
  }
}

function* submitSearchSaga(action: PayloadAction<SearchRequest>) {
  try {
    yield put(setSearching(true));
    
    // Add small delay for better UX
    yield call(() => new Promise(resolve => setTimeout(resolve, 300)));
    
    const suggestions: string[] = yield call(() => mockSearchApi(action.payload));
    yield put(submitSearchSuccess(suggestions));
  } catch (error) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Search failed',
      code: 'SEARCH_ERROR'
    };
    yield put(submitSearchFailure(apiError));
  }
}

// Import takeEvery and takeLatest
// eslint-disable-next-line @typescript-eslint/no-require-imports
const effects = require('redux-saga/effects');
const { takeEvery, takeLatest } = effects;

// Watcher sagas
function* watchInitializeHome() {
  yield takeEvery(initializeHome.type, initializeHomeSaga);
}

function* watchSubmitSearch() {
  yield takeLatest(submitSearch.type, submitSearchSaga);
}

// Root saga for home feature
export function* homeSaga() {
  yield takeEvery(initializeHome.type, initializeHomeSaga);
  yield takeLatest(submitSearch.type, submitSearchSaga);
}

export default homeSaga;
