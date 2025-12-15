'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { reviewApiService, ReviewItem } from '@/services/api/reviewApi';
import { useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/features/auth/login/redux/loginSlice';

import { ReviewsPresenter } from '../components/ReviewsPresenter';

interface ReviewsContainerProps {
  productDetailId: number;
}

export function ReviewsContainer({ productDetailId }: ReviewsContainerProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('newest');
  const [visibleReviewsCount, setVisibleReviewsCount] = useState<number>(5);
  const currentUser = useAppSelector(selectUser);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(2));
  }, [reviews]);

  const starDistribution = useMemo(() => {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (starFilter !== null) {
      filtered = filtered.filter(r => r.rating === starFilter);
    }

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

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const res = await reviewApiService.getReviewsByProduct(productDetailId);
    if (res.success && Array.isArray(res.data)) {
      setReviews(res.data);
    }
    setLoading(false);
  }, [productDetailId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setVisibleReviewsCount(5);
  }, [starFilter, dateFilter]);

  const handleViewMore = useCallback(() => {
    setVisibleReviewsCount(prev => prev + 5);
  }, []);

  const handleShowLess = useCallback(() => {
    setVisibleReviewsCount(5);
  }, []);

  return (
    <ReviewsPresenter
      reviews={reviews}
      loading={loading}
      average={average}
      starDistribution={starDistribution}
      filteredReviews={filteredReviews}
      displayedReviews={displayedReviews}
      starFilter={starFilter}
      dateFilter={dateFilter}
      visibleReviewsCount={visibleReviewsCount}
      currentUserId={currentUser?.id ? Number(currentUser.id) : null}
      onSetStarFilter={setStarFilter}
      onSetDateFilter={setDateFilter}
      onViewMore={handleViewMore}
      onShowLess={handleShowLess}
      productDetailId={productDetailId}
    />
  );
}
