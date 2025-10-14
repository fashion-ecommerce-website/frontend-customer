'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { reviewApiService, ReviewItem } from '@/services/api/reviewApi';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { useToast } from '@/providers/ToastProvider';

interface ReviewsSectionProps {
  productDetailId: number;
}

export function ReviewsSection({ productDetailId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { showError, showSuccess } = useToast();

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return parseFloat((sum / reviews.length).toFixed(2));
  }, [reviews]);

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

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`h-4 w-4 ${i < Math.round(average) ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-medium leading-none text-gray-500">({average || 0})</p>
            <span className="text-sm font-medium leading-none text-gray-900"> {reviews.length} Reviews </span>
          </div>
        </div>

        <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
          <div className="shrink-0 space-y-4">
            <p className="text-2xl font-semibold leading-none text-gray-900">{average || 0} out of 5</p>
            <button type="button" onClick={handleOpenModal} className="mb-2 me-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none">Write a review</button>
          </div>
        </div>

        <div className="mt-6 divide-y divide-gray-200">
          {loading && <div className="py-6 text-gray-500 text-sm">Loading reviews...</div>}
          {!loading && reviews.length === 0 && (
            <div className="py-6 text-gray-500 text-sm">No reviews yet.</div>
          )}
          {!loading && reviews.map((r) => (
            <div key={r.id} className="gap-3 py-6 sm:flex sm:items-start">
              <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < r.rating ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  ))}
                </div>

                <div className="space-y-0.5">
                  <p className="text-base font-semibold text-gray-900">{r.username}</p>
                  <p className="text-sm font-normal text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                <p className="text-base font-normal text-gray-700">{r.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <AddReviewModal
          productDetailId={productDetailId}
          onClose={() => setShowModal(false)}
          onSubmitted={async () => {
            const res = await reviewApiService.getReviewsByProduct(productDetailId);
            if (res.success && Array.isArray(res.data)) {
              setReviews(res.data);
              showSuccess('Review submitted');
            } else {
              showError(res.message || 'Failed to refresh reviews');
            }
          }}
        />
      )}
    </section>
  );
}

interface AddReviewModalProps {
  productDetailId: number;
  onClose: () => void;
  onSubmitted: () => void;
}

function AddReviewModal({ productDetailId, onClose, onSubmitted }: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const { showError } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) return;
    setBusy(true);
    const res = await reviewApiService.createReview({ productDetailId, rating, content });
    setBusy(false);
    if (res.success) {
      onClose();
      onSubmitted();
    } else {
      showError(res.message || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add a review</h3>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Rating</label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1"
                  aria-label={`Set rating ${i + 1}`}
                >
                  <svg className={`h-6 w-6 ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </button>
              ))}
              <span className="ms-2 text-sm font-medium text-gray-900">{rating}.0 out of 5</span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Review</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <button disabled={busy} type="submit" className="me-2 inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">
              {busy ? 'Submitting...' : 'Add review'}
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewsSection;


