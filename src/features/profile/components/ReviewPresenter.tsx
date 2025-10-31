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
      <svg
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
      </svg>
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
              className={`p-1 hover:scale-110 transition-transform ${
                index < editData.rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-500`}
              aria-label={`Set rating ${index + 1}`}
            >
              <svg className="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
              </svg>
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
    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        {/* Product Image & Name */}
        <div className="flex items-start gap-3 mb-3">
          {review.productImage && (
            <img
              src={review.productImage}
              alt={review.productName}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-black line-clamp-2 mb-1">
              {review.productName}
            </h3>
            {/* Product details */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600 mb-2">
              {review.productColor && (
                <span>
                  Color: <span className="font-medium">{review.productColor}</span>
                </span>
              )}
              {review.productSize && (
                <span>
                  Size: <span className="font-medium">{review.productSize}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Rating & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(review.rating)}</div>
            {review.isVerified && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {/* Comment */}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.comment}</p>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => handleEditClick(review)}
            className="flex-1 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(review.id, review.productName)}
            className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
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
    </div>
  );

  // Loading state
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
        <h2 className="text-base sm:text-lg font-semibold text-black">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-4 sm:p-6 rounded-lg max-w-sm w-full mx-4">
            <p className="mb-4 text-sm sm:text-base text-center">
              Are you sure you want to delete your review for "{confirmDelete.productName}"?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
              <button
                onClick={onCancelDelete}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onDeleteReview(confirmDelete.reviewId)}
                className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
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
