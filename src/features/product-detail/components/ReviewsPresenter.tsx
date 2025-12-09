'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { reviewApiService, ReviewItem } from '@/services/api/reviewApi';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/login/redux/loginSlice';
import { useToast } from '@/providers/ToastProvider';

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
  showModal: boolean;
  editingReview: ReviewItem | null;
  showDeleteModal: boolean;
  isAuthenticated: boolean;
  currentUserId: number | null;
  onOpenModal: () => void;
  onEditReview: (review: ReviewItem) => void;
  onDeleteReview: (reviewId: number) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onSetStarFilter: (star: number | null) => void;
  onSetDateFilter: (filter: string) => void;
  onViewMore: () => void;
  onShowLess: () => void;
  onCloseModal: () => void;
  onSubmitReview: () => void;
  productDetailId: number;
}

// Avatar component
function UserAvatar({ username, avatar, size = 'md' }: { username: string; avatar?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (avatar) {
    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src={avatar}
          alt={`${username}'s avatar`}
          className="rounded-full object-cover border-2 border-gray-200"
          fill
          sizes="48px"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="${sizeClasses[size]} rounded-full ${getAvatarColor(username)} flex items-center justify-center font-medium text-white border-2 border-gray-200">
                  ${getInitials(username)}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getAvatarColor(username)} flex items-center justify-center font-medium text-white border-2 border-gray-200`}>
      {getInitials(username)}
    </div>
  );
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
    showDeleteModal,
    currentUserId,
    onOpenModal,
    onEditReview,
    onDeleteReview,
    onConfirmDelete,
    onCancelDelete,
    onSetStarFilter,
    onSetDateFilter,
    onViewMore,
    onShowLess,
  } = props;

  const getStarPercentage = (starCount: number): number => {
    if (reviews.length === 0) return 0;
    return (starCount / reviews.length) * 100;
  };

  const isUserReview = (review: ReviewItem): boolean => {
    return currentUserId ? currentUserId === review.userId : false;
  };

  const generateAvatarUrl = (username: string): string => {
    const seed = username.toLowerCase().replace(/\s+/g, '');
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  };

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Reviews</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">({average})</span>
              <span className="text-base sm:text-lg font-semibold text-black underline cursor-pointer">{reviews.length} Reviews</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onOpenModal} 
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
          >
            Write a review
          </button>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {/* Average Rating */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{average}</div>
              <div className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">out of 5</div>
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
                    {starDistribution[star]} reviews
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
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</label>
              <select
                value={starFilter || ''}
                onChange={(e) => onSetStarFilter(e.target.value ? Number(e.target.value) : null)}
                className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">All</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Sort:</label>
              <select
                value={dateFilter}
                onChange={(e) => onSetDateFilter(e.target.value)}
                className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {loading && <div className="py-12 text-gray-500 text-center">Loading reviews...</div>}
          {!loading && reviews.length === 0 && (
            <div className="py-12 text-gray-500 text-center">
              <div className="text-lg mb-2">No reviews yet</div>
              <div className="text-sm">Be the first to share your experience!</div>
            </div>
          )}
          {!loading && filteredReviews.length === 0 && reviews.length > 0 && (
            <div className="py-12 text-gray-500 text-center">
              <div className="text-lg mb-2">It is empty here!</div>
              <div className="text-sm">Try adjusting your filter criteria</div>
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
                    <span className="text-xs sm:text-sm text-green-600">Verified purchase</span>
                  </div>
                </div>
                {isUserReview(r) && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEditReview(r)}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                      title="Edit review"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteReview(r.id)}
                      className="text-gray-500 hover:text-red-600 transition-colors p-1"
                      title="Delete review"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3 mb-2">
                  <UserAvatar 
                    username={r.username} 
                    avatar={r.avatar || generateAvatarUrl(r.username)} 
                    size="md" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">{r.username}</span>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {' at '}
                        {new Date(r.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {(r.productColor || r.productSize) && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                          {r.productColor && (
                            <span className="text-xs sm:text-sm text-gray-600">
                              Color: <span className="font-medium">{r.productColor}</span>
                            </span>
                          )}
                          {r.productSize && (
                            <span className="text-xs sm:text-sm text-gray-600">
                              Size: <span className="font-medium">{r.productSize}</span>
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
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                View More Reviews
              </button>
            ) : (
              <button
                onClick={onShowLess}
                className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                Show Less
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Review</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                Are you sure you want to delete this review? This action cannot be undone and the review will be permanently removed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onCancelDelete}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
