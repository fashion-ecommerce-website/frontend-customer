'use client';

import React, { useState } from 'react';
import { OrderModal } from '@/components';

export default function TestOrderPage() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handleOpenOrder = () => {
    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Order Modal
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Trang này để test OrderModal khi chưa có cart. 
              Bạn có thể mở modal order để xem layout và functionality.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn test:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Click "Open Order Modal" để mở modal</li>
                <li>• Test nút "Back to Cart" để đóng modal</li>
                <li>• Test click outside modal để đóng</li>
                <li>• Test nút X ở góc phải header</li>
                <li>• Test responsive trên mobile/desktop</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleOpenOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🛒 Open Order Modal
            </button>

            <div className="text-sm text-gray-500">
              <p>Modal sẽ hiển thị toàn bộ form order với:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Shipment Header</li>
                <li>Address Form</li>
                <li>Shipping Method</li>
                <li>Payment Methods</li>
                <li>Order Summary (với nút Back to Cart)</li>
              </ul>
            </div>
          </div>

          <OrderModal 
            isOpen={isOrderOpen} 
            onClose={handleCloseOrder} 
          />
        </div>
      </div>
    </div>
  );
}
