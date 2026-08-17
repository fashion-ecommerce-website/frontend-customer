'use client';

// Home Presenter Component
// Presentational component for home page UI

import React from 'react';
import { HomePresenterProps } from '../types/home.types';
import { Banner } from './Banner';
import { RankingSection } from './RankingSection';
import { RecommendContainer } from '../containers/RecommendContainer';
import { NewArrivalsContainer } from '../containers/NewArrivalsContainer';
import { VirtualTryOnBanner } from './VirtualTryOnBanner';
import { NewsletterSignup } from './NewsletterSignup';

export const HomePresenter: React.FC<HomePresenterProps> = ({
  banners,
  isLoading,
  error,
  onClearError,
  onBannerClick,
}) => {

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 relative mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-xl shadow-xs">
          <span className="block sm:inline text-sm sm:text-base">{error}</span>
          <button
            onClick={onClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-red-100 rounded-r-xl transition-colors"
            aria-label="Dismiss error"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C5A880]"></div>
            <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Loading collection...</span>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {/* Main Hero Banner */}
          <Banner
            banners={banners}
            onBannerClick={onBannerClick}
          />

          {/* Luxury Brand Marquee Strip */}
          <div className="bg-neutral-950 border-y border-neutral-800/80 py-4 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-around flex-wrap gap-4 sm:gap-8 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-neutral-400">
              <span className="hover:text-[#C5A880] transition-colors cursor-default">DIOR</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="hover:text-[#C5A880] transition-colors cursor-default">CHANEL</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="hover:text-[#C5A880] transition-colors cursor-default">LOUIS VUITTON</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="hover:text-[#C5A880] transition-colors cursor-default">SAINT LAURENT</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="hover:text-[#C5A880] transition-colors cursor-default">GUCCI</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <span className="hover:text-[#C5A880] transition-colors cursor-default">HERMÈS</span>
            </div>
          </div>

          {/* Main Content Grid Sections */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
            <NewArrivalsContainer />

            <VirtualTryOnBanner />

            <RecommendContainer />

            <RankingSection />
          </div>

          {/* Newsletter Signup at Bottom */}
          <div className="mt-8 sm:mt-16 border-t border-neutral-200">
            <NewsletterSignup onSubmit={(email) => console.log('Subscribed:', email)} />
          </div>
        </div>
      )}
    </div>
  );
};
