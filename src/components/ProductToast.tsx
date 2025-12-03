'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export interface ProductToastProps {
  productImage: string;
  productTitle: string;
  productPrice: number;
  finalPrice?: number; // Price after promotion
  quantity?: number;
  duration?: number;
  onClose: () => void;
}

export const ProductToast: React.FC<ProductToastProps> = ({ 
  productImage,
  productTitle,
  productPrice,
  finalPrice,
  quantity = 1,
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    setIsVisible(true);
    
    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for slide out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg transform transition-all duration-300 ease-in-out bg-white border border-gray-200";
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    return `${baseStyles} translate-x-0 opacity-100`;
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={getToastStyles()}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Successfully added to cart</span>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Product Image */}
          <div className="relative flex-shrink-0 w-16 h-20">
            <Image
              src={productImage}
              alt={productTitle}
              fill
              className="object-cover rounded-lg border border-gray-200"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
              {productTitle}
            </h4>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(finalPrice || productPrice)}
              </p>
              {quantity > 1 && (
                <span className="text-xs text-gray-500">
                  Quantity: {quantity}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};