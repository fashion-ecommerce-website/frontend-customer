'use client';

import React from 'react';
import { OrderPresenter } from '@/features/order/components/OrderPresenter';
import { ProductItem } from '@/services/api/productApi';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: ProductItem[];
  note?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, products, note }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] mx-auto shadow-2xl border border-gray-200 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10 rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close order modal"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          <OrderPresenter onClose={onClose} products={products} note={note} />
        </div>
      </div>
    </div>
  );
};
