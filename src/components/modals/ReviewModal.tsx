'use client';

import React, { useState } from 'react';
import { Order } from '@/features/order/types';
import { useToast } from '@/providers/ToastProvider';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit?: (orderId: number, reviews: { orderId: number; orderDetailId: number; rating: number; comment: string }[]) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, order, onSubmit }) => {
  const [reviews, setReviews] = useState<Record<number, { rating: number; comment: string }>>({});
    const { showError, showSuccess } = useToast();

  if (!isOpen || !order) return null;

  const handleRatingChange = (orderDetailId: number, rating: number) => {
    setReviews(prev => ({
      ...prev,
      [orderDetailId]: {
        rating,
        comment: prev[orderDetailId]?.comment || ''
      }
    }));
  };

  const handleCommentChange = (orderDetailId: number, comment: string) => {
    setReviews(prev => ({
      ...prev,
      [orderDetailId]: {
        rating: prev[orderDetailId]?.rating || 0,
        comment
      }
    }));
  };

  const handleSubmitAll = () => {
    if (!order) return;
    
    const reviewsArray = Object.entries(reviews)
      .filter(([, review]) => review.rating > 0)
      .map(([orderDetailId, review]) => ({
        orderId: order.id,
        orderDetailId: Number(orderDetailId),
        rating: review.rating,
        comment: review.comment
      }));

    if (reviewsArray.length === 0) {
      showError('Please rate at least one product');
      return;
    }

    onSubmit?.(order.id, reviewsArray);
    setReviews({});
    onClose();
  };
  
  // Keep for potential future use
  void handleSubmitAll;

  // Gửi review cho từng sản phẩm
  const handleSubmitSingle = async (orderDetailId: number) => {
    if (!order) return;
    const review = reviews[orderDetailId];
    if (!review || review.rating === 0) {
      showError('Please rate this product');
      return;
    }
    try {
      const resp = await onSubmit?.(order.id, [{
        orderId: order.id,
        orderDetailId: orderDetailId,
        rating: review.rating,
        comment: review.comment
      }]);
      const apiResp = (resp ?? {}) as { success?: boolean; message?: string };
      if (apiResp && apiResp.success) {
        showSuccess('Review submitted successfully!');
        setReviews(prev => ({ ...prev, [orderDetailId]: { rating: 0, comment: '' } }));
      } else {
        showError(apiResp?.message || 'You can only review this product once!');
      }
    } catch {
      showError('Failed to submit review!');
    }
  };

  const handleClose = () => {
    setReviews({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Review Order #{order.id}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {order.orderDetails.map((detail) => {
                const currentReview = reviews[detail.id] || { rating: 0, comment: '' };
                const imageSrc = detail.images?.[0] || '/images/products/image1.jpg';
                return (
                  <div key={detail.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                    {/* Product Info */}
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-24 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imageSrc}
                          alt={detail.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{detail.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {detail.colorLabel} / {detail.sizeLabel}
                        </p>
                        <div className="flex gap-4 mt-1 text-sm text-gray-600">
                          <span>Quantity: <span className="font-medium text-black">{detail.quantity}</span></span>
                          <span>Price: <span className="font-medium text-black">{(detail.finalPrice ?? detail.unitPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 })}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(detail.id, star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= currentReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                              fill={star <= currentReview.rating ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review (Optional)
                      </label>
                      <textarea
                        value={currentReview.comment}
                        onChange={(e) => handleCommentChange(detail.id, e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-md  resize-none"
                      />
                    </div>
                    {/* Submit button for this product */}
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleSubmitSingle(detail.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Gửi review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
