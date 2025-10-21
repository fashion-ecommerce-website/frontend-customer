/**
 * Review Presenter Component
 * Pure UI component for displaying user's reviews
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ReviewPresenterProps } from '../types/profile.types';
import { 
  PageLoadingSpinner, 
  ErrorMessage, 
  LoadingSpinner 
} from '../../../components';
import { Pagination } from '../../filter-product/components/Pagination';
import { useToast } from '../../../providers/ToastProvider';

export const ReviewPresenter: React.FC<ReviewPresenterProps> = ({
  reviews,
  totalReviews,
  isLoading,
  isSubmitting,
  error,
  submitSuccess,
  lastActionType,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  confirmDelete,
  onPageChange,
  onEditReview,
  onDeleteReview,
  onConfirmDelete,
  onCancelDelete,
  onClearError,
}) => {
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editData, setEditData] = useState({ rating: 0, comment: '' });
  const { showSuccess } = useToast();

  // Show toast for success (both edit and delete)
  useEffect(() => {
    if (submitSuccess && lastActionType) {
      if (lastActionType === 'edit') {
        showSuccess('Review updated successfully!');
      } else if (lastActionType === 'delete') {
        showSuccess('Review deleted successfully!');
      }
    }
  }, [submitSuccess, lastActionType, showSuccess]);

  const handleEditClick = (review: any) => {
    setEditingReview(review.id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleEditCancel = () => {
    setEditingReview(null);
    setEditData({ rating: 0, comment: '' });
  };

  const handleEditSave = () => {
    if (editingReview) {
      onEditReview(editingReview, editData);
      setEditingReview(null);
      setEditData({ rating: 0, comment: '' });
    }
  };

  const handleDeleteClick = (reviewId: string, productName: string) => {
    onConfirmDelete(reviewId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const renderEditForm = (review: any) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setEditData({ ...editData, rating: index + 1 })}
              className={`text-2xl ${
                index < editData.rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-500 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          value={editData.comment}
          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          rows={4}
          placeholder="Write your review..."
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleEditSave}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleEditCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderReviewCard = (review: any) => (
    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Product info and action buttons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {review.productImage && (
              <img
                src={review.productImage}
                alt={review.productName}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-black">
                {review.productName}
              </h3>
              {/* Product details */}
              <div className="flex items-center space-x-2 mb-2">
                {review.productColor && (
                  <span className="text-sm text-gray-600">
                    Color: <span className="font-medium">{review.productColor}</span>
                  </span>
                )}
                {review.productSize && (
                  <span className="text-sm text-gray-600">
                    Size: <span className="font-medium">{review.productSize}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                {review.isVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => handleEditClick(review)}
            className="text-gray-500 border-b border-gray-500 hover:text-black hover:border-black text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(review.id, review.productName)}
            className="text-gray-500 border-b border-gray-500 hover:text-red-600 hover:border-red-600 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Comment section - aligned with product name */}
      <div className="ml-24">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
        <h2 className="text-lg font-semibold text-black">
          {totalReviews} Reviews
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error.message}
          className="mb-6"
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          
          <p className="mt-4 text-sm text-gray-400">No reviews stored</p>
          <p className="mt-1 text-sm text-gray-400">Start reviewing your purchased products</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id}>
                {editingReview === review.id ? (
                  renderEditForm(review)
                ) : (
                  renderReviewCard(review)
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={onPageChange}
          />
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-sm w-full">
            <p className="mb-4 text-center">
              Are you sure you want to delete your review for "{confirmDelete.productName}"?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancelDelete}
                className="w-[20vh] px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onDeleteReview(confirmDelete.reviewId)}
                className="w-[20vh] px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
