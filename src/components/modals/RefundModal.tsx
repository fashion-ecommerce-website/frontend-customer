'use client';

import React, { useState } from 'react';
import { Order } from '@/features/order/types';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (orderId: number, reason: string, refundAmount: number) => Promise<void>;
  loading?: boolean;
}

const REFUND_REASON_SUGGESTIONS = [
  'Product is defective or does not match the website description',
  'Received wrong size/color',
  'Product was damaged during shipping',
  'Received duplicate product',
  'No longer need this product',
];

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (value !== 'custom') {
      setCustomReason('');
    }
  };

  const getFinalReason = () => {
    if (reason === 'custom') {
      return customReason;
    }
    return reason;
  };

  const handleConfirm = async () => {
    const finalReason = getFinalReason();
    
    if (!finalReason.trim()) {
      setError('Please provide a reason for the refund request');
      return;
    }

    setError(null);
    try {
      await onConfirm(order.id, finalReason, order.totalAmount);
      setReason('');
      setCustomReason('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit refund request');
    }
  };

  const handleClose = () => {
    setReason('');
    setCustomReason('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Request Refund</h2>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Total</span>
              <span className="font-medium text-gray-900">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-medium text-green-600">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Refund Amount */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Refund Amount:</span>
              <span className="text-lg font-bold text-black">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => handleReasonChange(e.target.value)}
                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Select a reason...</option>
                {REFUND_REASON_SUGGESTIONS.map((r, index) => (
                  <option key={index} value={r}>
                    {r}
                  </option>
                ))}
                <option value="custom">Other (specify below)</option>
              </select>
              {/* Chevron icon - same as ProductFilter */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Custom Reason Input */}
          {reason === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please describe your reason
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter your reason for requesting a refund..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors resize-none"
                rows={3}
                disabled={loading}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !getFinalReason().trim()}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
