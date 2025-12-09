'use client';

// Home Presenter Component
// Presentational component for home page UI

import React from 'react';
import { HomePresenterProps } from '../types/home.types';
import { Banner } from './Banner';
import { NewsletterSignup } from './NewsletterSignup';
import { RankingSection } from './RankingSection';
import { RecommendContainer } from '../containers/RecommendContainer';
import { NewArrivalsContainer } from '../containers/NewArrivalsContainer';
import { AnimatedSection } from '@/components/AnimatedSection';

export const HomePresenter: React.FC<HomePresenterProps> = ({
  banners,
  isLoading,
  error,
  onClearError,
  onBannerClick,
}) => {

  return (
    <div className="bg-white">
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
          <Banner
            banners={banners}
            onBannerClick={onBannerClick}
          />

          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <NewArrivalsContainer />

            <RecommendContainer />

            <RankingSection />
          </div>

          <NewsletterSignup onSubmit={(email) => console.log('subscribe', email)} />
        </div>
      )}
    </div>
  );
};
