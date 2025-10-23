'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { reviewApiService, ReviewItem, UpdateReviewRequest } from '@/services/api/reviewApi';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/login/redux/loginSlice';
import { useToast } from '@/providers/ToastProvider';

interface ReviewsSectionProps {
  productDetailId: number;
}

interface StarDistribution {
  [key: number]: number;
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

  // Generate a consistent color based on username
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
      <div className="relative">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
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

export function ReviewsSection({ productDetailId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [helpfulnessVotes, setHelpfulnessVotes] = useState<{[key: number]: {yes: number, no: number}}>({});
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('newest');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(5);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectUser);
  const { showError, showSuccess } = useToast();

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(2));
  }, [reviews]);

  const starDistribution = useMemo((): StarDistribution => {
    const distribution: StarDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  }, [reviews]);

  const getStarPercentage = (starCount: number): number => {
    if (reviews.length === 0) return 0;
    return (starCount / reviews.length) * 100;
  };

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filter by star rating
    if (starFilter !== null) {
      filtered = filtered.filter(r => r.rating === starFilter);
    }

    // Filter by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      switch (dateFilter) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [reviews, starFilter, dateFilter]);

  const displayedReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleReviewsCount);
  }, [filteredReviews, visibleReviewsCount]);

  // Generate avatar URL for demo purposes (you can replace this with real avatar logic)
  const generateAvatarUrl = (username: string): string => {
    // Using DiceBear API for demo avatars
    const seed = username.toLowerCase().replace(/\s+/g, '');
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      const res = await reviewApiService.getReviewsByProduct(productDetailId);
      if (mounted) {
        if (res.success && Array.isArray(res.data)) setReviews(res.data);
        setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [productDetailId]);

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?returnUrl=/products/${productDetailId}`;
      return;
    }
    setShowModal(true);
  };

  const handleHelpfulnessVote = (reviewId: number, isHelpful: boolean) => {
    setHelpfulnessVotes(prev => ({
      ...prev,
      [reviewId]: {
        yes: isHelpful ? (prev[reviewId]?.yes || 0) + 1 : (prev[reviewId]?.yes || 0),
        no: !isHelpful ? (prev[reviewId]?.no || 0) + 1 : (prev[reviewId]?.no || 0)
      }
    }));
  };

  const isUserReview = (review: ReviewItem): boolean => {
    return currentUser?.id ? Number(currentUser.id) === review.userId : false;
  };

  const handleEditReview = (review: ReviewItem) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleDeleteReview = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await reviewApiService.deleteReview(reviewToDelete);
      if (res.success) {
        // Remove the review from local state
        setReviews(prev => prev.filter(r => r.id !== reviewToDelete));
        showSuccess('Review deleted successfully');
      } else {
        showError(res.message || 'Failed to delete review');
      }
    } catch (error) {
      showError('Failed to delete review');
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const cancelDeleteReview = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleViewMore = () => {
    setVisibleReviewsCount(prev => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleReviewsCount(5);
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleReviewsCount(5);
  }, [starFilter, dateFilter]);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-8xl px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-5 w-5 ${i < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">({average})</span>
              <span className="text-lg font-semibold text-black underline cursor-pointer">{reviews.length} Reviews</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleOpenModal} 
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Write a review
          </button>
        </div>

        {/* Review Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Average Rating */}
          <div className="lg:col-span-1">
            <div className="text-center lg:text-left">
              <div className="text-5xl font-bold text-gray-900 mb-2">{average}</div>
              <div className="text-lg text-gray-600 mb-4">out of 5</div>
              <div className="flex items-center justify-center lg:justify-start gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-6 w-6 ${i < Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Star Distribution */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getStarPercentage(starDistribution[star])}%` }}
                    />
                  </div>
                  <span className="text-sm text-blue-600 font-medium w-20 text-right">
                    {starDistribution[star]} reviews
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Star Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by rating:</label>
                <select
                  value={starFilter || ''}
                  onChange={(e) => setStarFilter(e.target.value ? Number(e.target.value) : null)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
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
            <div key={r.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-600">Verified purchase</span>
                  </div>
                </div>
                {isUserReview(r) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditReview(r)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title="Edit review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Reviewer Info */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <UserAvatar 
                    username={r.username} 
                    avatar={r.avatar || generateAvatarUrl(r.username)} 
                    size="md" 
                  />
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{r.username}</span>
                      <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} at {new Date(r.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</div>
                      
                      {/* Product details - Color and Size */}
                      {(r.productColor || r.productSize) && (
                        <div className="flex items-center space-x-2">
                          {r.productColor && (
                            <span className="text-sm text-gray-600">
                              Color: <span className="font-medium">{r.productColor}</span>
                            </span>
                          )}
                          {r.productSize && (
                            <span className="text-sm text-gray-600">
                              Size: <span className="font-medium">{r.productSize}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">{r.content}</p>

              {/* Helpfulness Section */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-3">Was it helpful to you?</p>
                <div className="flex gap-6">
                  <button 
                    onClick={() => handleHelpfulnessVote(r.id, true)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors group"
                    title="Helpful"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">{helpfulnessVotes[r.id]?.yes || 0}</span>
                  </button>
                  <button 
                    onClick={() => handleHelpfulnessVote(r.id, false)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-600 transition-colors group"
                    title="Not helpful"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M21.8 15.7c-.2.2-.4.3-.7.3h-5.6l1.3 4.9c.1.3 0 .6-.2.8-.2.2-.4.3-.7.3h-3.1c-.3 0-.7-.2-.8-.5L9 16H7.7c-.3.6-1 1-1.7 1H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h5v13h1.6l3.3 6h2.9l-1.6-6H21L19.1 3h-8.6c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h8.6c.5 0 .8.3.9.8l2 12.1c0 .3 0 .6-.2.8zM7 3H3c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1h3c.6 0 1-.4 1-1V3zM5.5 5.5c0-.6-.4-1-1-1s-1 .4-1 1 .4 1 1 1 1-.4 1-1z"/>
                    </svg>
                    <span className="font-medium">{helpfulnessVotes[r.id]?.no || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* View More/Less Controls */}
        {!loading && filteredReviews.length > 5 && (
          <div className="mt-8 text-center">
            {visibleReviewsCount < filteredReviews.length ? (
              <button
                onClick={handleViewMore}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                View More Reviews
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Review</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this review? This action cannot be undone and the review will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteReview}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteReview}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
        <AddReviewModal
          productDetailId={productDetailId}
          editingReview={editingReview}
          onClose={() => {
            setShowModal(false);
            setEditingReview(null);
          }}
          onSubmitted={async () => {
            const res = await reviewApiService.getReviewsByProduct(productDetailId);
            if (res.success && Array.isArray(res.data)) {
              setReviews(res.data);
              showSuccess(editingReview ? 'Review updated successfully' : 'Review submitted');
            } else {
              showError(res.message || 'Failed to refresh reviews');
            }
            setEditingReview(null);
          }}
        />
      )}
    </section>
  );
}

interface AddReviewModalProps {
  productDetailId: number;
  editingReview?: ReviewItem | null;
  onClose: () => void;
  onSubmitted: () => void;
}

function AddReviewModal({ productDetailId, editingReview, onClose, onSubmitted }: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(editingReview?.rating || 5);
  const [content, setContent] = useState<string>(editingReview?.content || '');
  const [busy, setBusy] = useState<boolean>(false);
  const { showError } = useToast();

  const isEditing = !!editingReview;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) return;
    setBusy(true);
    
    try {
      let res;
      if (isEditing) {
        res = await reviewApiService.updateReview(editingReview.id, { rating, content });
      } else {
        res = await reviewApiService.createReview({ productDetailId, rating, content });
      }
      
      if (res.success) {
        onClose();
        onSubmitted();
      } else {
        // Check if the error message indicates user has already reviewed
        const errorMessage = res.message || '';
        if (errorMessage.toLowerCase().includes('already') || 
            errorMessage.toLowerCase().includes('duplicate') ||
            errorMessage.toLowerCase().includes('exists')) {
          showError('You have already reviewed this product');
        } else {
          showError(res.message || `Failed to ${isEditing ? 'update' : 'submit'} review`);
        }
      }
    } catch (error) {
      // Check if the error message indicates user has already reviewed
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('already') || 
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('exists')) {
        showError('You have already reviewed this product');
      } else {
        showError(`Failed to ${isEditing ? 'update' : 'submit'} review`);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Review' : 'Add a review'}
          </h3>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">Rating</label>
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Set rating ${i + 1}`}
                >
                  <svg className={`h-8 w-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-lg font-medium text-gray-900">{rating}.0/5.0</span>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-900">Review</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black focus:outline-none"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this product..."
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              disabled={busy} 
              type="submit" 
              className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
            >
              {busy ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewsSection;


