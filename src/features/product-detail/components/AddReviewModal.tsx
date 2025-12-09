'use client';

import React, { useState } from 'react';
import { reviewApiService, ReviewItem } from '@/services/api/reviewApi';
import { useToast } from '@/providers/ToastProvider';

interface AddReviewModalProps {
  productDetailId: number;
  editingReview?: ReviewItem | null;
  onClose: () => void;
  onSubmitted: () => void;
}

export function AddReviewModal({ productDetailId, editingReview, onClose, onSubmitted }: AddReviewModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Review' : 'Add a review'}
          </h3>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="mb-2 sm:mb-3 block text-sm font-medium text-gray-900">Rating</label>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`Set rating ${i + 1}`}
                >
                  <svg className={`h-7 w-7 sm:h-8 sm:w-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </button>
              ))}
              <span className="ml-1 sm:ml-3 text-base sm:text-lg font-medium text-gray-900">{rating}.0/5.0</span>
            </div>
          </div>
          <div>
            <label className="mb-2 sm:mb-3 block text-sm font-medium text-gray-900">Review</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-500 focus:border-black focus:ring-black focus:outline-none"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this product..."
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              disabled={busy} 
              type="submit" 
              className="w-full sm:flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-60 text-sm sm:text-base"
            >
              {busy ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
