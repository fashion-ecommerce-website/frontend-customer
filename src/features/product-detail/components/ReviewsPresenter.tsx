'use client';

import React from 'react';
import Image from 'next/image';
import { ReviewItem } from '@/services/api/reviewApi';
import { useLanguage } from '@/hooks/useLanguage';

interface ReviewsPresenterProps {
  reviews: ReviewItem[];
  loading: boolean;
  average: number;
  starDistribution: { [key: number]: number };
  filteredReviews: ReviewItem[];
  displayedReviews: ReviewItem[];
  starFilter: number | null;
  dateFilter: string;
  visibleReviewsCount: number;
  currentUserId: number | null;
  onSetStarFilter: (star: number | null) => void;
  onSetDateFilter: (filter: string) => void;
  onViewMore: () => void;
  onShowLess: () => void;
  productId: number;
}

// Avatar component with anonymous fallback icon
function UserAvatar({ username, avatar, size = 'md' }: { username: string; avatar?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  // Anonymous user icon fallback (same as profile page)
  const renderFallbackIcon = () => (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-200`}>
      <svg className={`${iconSizeClasses[size]} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  if (avatar) {
    return (
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200`}>
        <Image
          src={avatar}
          alt={`${username}'s avatar`}
          className="object-cover"
          fill
          sizes="48px"
          onError={(e) => {
            // Fallback to anonymous icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-icon')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300';
              fallback.innerHTML = `<svg class="${iconSizeClasses[size]} text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>`;
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
    );
  }

  return renderFallbackIcon();
}

export function ReviewsPresenter(props: ReviewsPresenterProps) {
  const {
    reviews,
    loading,
    average,
    starDistribution,
    filteredReviews,
    displayedReviews,
    starFilter,
    dateFilter,
    visibleReviewsCount,
    currentUserId,
    onSetStarFilter,
    onSetDateFilter,
    onViewMore,
    onShowLess,
  } = props;

  const { translations, lang } = useLanguage();

  const getStarPercentage = (starCount: number): number => {
    if (reviews.length === 0) return 0;
    return (starCount / reviews.length) * 100;
  };

  // Keep currentUserId for potential future use (e.g., edit own review)
  void currentUserId;

  // Use user's real avatar if available, otherwise return undefined to show fallback icon
  const getAvatarUrl = (review: ReviewItem): string | undefined => {
    return review.avatarUrl || review.avatar || undefined;
  };

  // Format date based on language
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{translations.review.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">({average})</span>
              <span className="text-base sm:text-lg font-semibold text-black underline cursor-pointer">{translations.review.reviewsCount.replace('{count}', String(reviews.length))}</span>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {/* Average Rating */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{average}</div>
              <div className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">{translations.review.outOf}</div>
              <div className="flex items-center justify-center lg:justify-start gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-5 w-5 sm:h-6 sm:w-6 ${i < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Star Distribution */}
          <div>
            <div className="space-y-2 sm:space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 w-6 sm:w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                    <div 
                      className="bg-yellow-400 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getStarPercentage(starDistribution[star])}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-blue-600 font-medium w-16 sm:w-20 text-right">
                    {starDistribution[star]} {translations.review.reviews}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-row gap-2 sm:gap-4 items-center justify-end flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{translations.review.filter}</label>
              <select
                value={starFilter || ''}
                onChange={(e) => onSetStarFilter(e.target.value ? Number(e.target.value) : null)}
                className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">{translations.review.all}</option>
                <option value="5">5 {translations.review.stars}</option>
                <option value="4">4 {translations.review.stars}</option>
                <option value="3">3 {translations.review.stars}</option>
                <option value="2">2 {translations.review.stars}</option>
                <option value="1">1 {translations.review.star}</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{translations.review.sort}</label>
              <select
                value={dateFilter}
                onChange={(e) => onSetDateFilter(e.target.value)}
                className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="newest">{translations.review.newestFirst}</option>
                <option value="oldest">{translations.review.oldestFirst}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {loading && <div className="py-12 text-gray-500 text-center">{translations.review.loadingReviews}</div>}
          {!loading && reviews.length === 0 && (
            <div className="py-12 text-gray-500 text-center">
              <div className="text-lg mb-2">{translations.review.noReviewsYet}</div>
              <div className="text-sm">{translations.review.beFirstToReview}</div>
            </div>
          )}
          {!loading && filteredReviews.length === 0 && reviews.length > 0 && (
            <div className="py-12 text-gray-500 text-center">
              <div className="text-lg mb-2">{translations.review.emptyHere}</div>
              <div className="text-sm">{translations.review.tryAdjustFilter}</div>
            </div>
          )}
          {!loading && displayedReviews.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm text-green-600">{translations.review.verifiedPurchase}</span>
                  </div>
                </div>

              </div>

              <div className="mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3 mb-2">
                  <UserAvatar 
                    username={r.username} 
                    avatar={getAvatarUrl(r)} 
                    size="md" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">{r.username}</span>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {formatDate(r.createdAt)}
                        {' - '}
                        {formatTime(r.createdAt)}
                      </div>
                      {(r.productColor || r.productSize) && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          {r.productColor && (
                            <span className="text-xs sm:text-sm text-gray-600">
                              {translations.review.color} <span className="font-medium">{r.productColor}</span>
                            </span>
                          )}
                          {r.productSize && (
                            <span className="text-xs sm:text-sm text-gray-600">
                              {translations.review.size} <span className="font-medium">{r.productSize}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>

        {/* View More/Less Controls */}
        {!loading && filteredReviews.length > 5 && (
          <div className="mt-6 sm:mt-8 text-center">
            {visibleReviewsCount < filteredReviews.length ? (
              <button
                onClick={onViewMore}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                {translations.review.viewMoreReviews}
              </button>
            ) : (
              <button
                onClick={onShowLess}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                {translations.review.showLess}
              </button>
            )}
          </div>
        )}


      </div>
    </section>
  );
}
