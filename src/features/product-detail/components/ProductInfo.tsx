'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '@/hooks/redux';
import { useCartActions } from '@/hooks/useCartActions';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { ProductDetail } from '@/services/api/productApi';

interface ProductInfoProps {
  product: ProductDetail;
  selectedColor: string | null;
  selectedSize: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  isColorLoading?: boolean;
}

export function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  isColorLoading = false,
}: ProductInfoProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { addToCartWithToast } = useCartActions({
    onSuccess: () => {
      setAddingToCart(false);
    },
    onError: () => {
      setAddingToCart(false);
    }
  });
  
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSizeNotice, setShowSizeNotice] = useState(false);
  const isAllSizesOut = (() => {
    const quantities = Object.values(product.mapSizeToQuantity || {});
    return quantities.length > 0 && quantities.every((q) => q === 0);
  })();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);
      
      await addToCartWithToast({
        productDetailId: product.detailId,
        quantity: quantity,
        // Additional data for toast
        productImage: product.images[0] || '/images/placeholder.jpg',
        productTitle: product.title,
        price: product.price
      });
    } catch (error) {
      // Error handling is done in the hook
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000); // Hide after 3 seconds
      return;
    }
    // Buy now logic here
    console.log('Buy now:', { product: product.detailId, color: selectedColor, size: selectedSize });
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-black">
          {formatPrice(product.price)}
        </div>
      </div>

      {/* Color Selection - MLB Style */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 pl-1">
          <div className="swatch-color" data-index="option1">
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <div 
                  key={color}
                  className={`item-swatch cursor-pointer ${
                    selectedColor === color ? 'active' : ''
                  } ${isColorLoading ? 'pointer-events-none' : ''}`}
                  data-color={color}
                  onClick={() => !isColorLoading && onColorSelect(color)}
                >
                  <div className={`w-10 h-10 rounded-full border-4 ring-2 ring-white transition-all duration-200 ${
                    selectedColor === color
                      ? 'border-black'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${isColorLoading ? 'opacity-70' : 'opacity-100'}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Selection */}
      {Object.keys(product.mapSizeToQuantity).length > 0 && (
        <div className="space-y-3 relative">
          {/* Size Selection Notice - Positioned above "Choose size" label */}
          <div 
            className={`absolute z-10 transition-all duration-250 ease-in-out pointer-events-none ${
              showSizeNotice 
                ? 'opacity-100 visible -top-16 left-0' 
                : 'opacity-0 invisible -top-16 left-0'
            }`}
            style={{
              filter: 'drop-shadow(0px 0px 10px rgba(46, 46, 46, 0.4))',
              background: '#2E2E2E',
              color: 'white',
              padding: '12px 19px',
              letterSpacing: '1px',
              borderRadius: '4px'
            }}
          >
            Please select size
            {/* Tooltip arrow pointing down */}
            <div 
              className="absolute -bottom-1 left-4 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #2E2E2E'
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Choose size</h3>
            <button 
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gray-800 hover:text-gray-900 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={1.5}/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth={1.5}/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth={1.5}/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.5}/>
              </svg>
              <span>Size guide</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            {Object.entries(product.mapSizeToQuantity).map(([size, quantity]) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                disabled={quantity === 0}
                className={`w-14 h-10 text-sm font-medium border rounded-full transition-all duration-200 flex items-center justify-center ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : quantity === 0
                    ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-default'
                    : 'border-gray-300 text-gray-800 hover:border-gray-400 cursor-pointer'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Quantity</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAllSizesOut ? (
          <div className="w-full h-14 flex items-center justify-center mt-6">
            <button
              disabled
              className="w-full h-full text-center uppercase text-base font-normal text-black font-bold bg-gray-100"
            >
              Out of stock
            </button>
          </div>
        ) : (
           <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || !selectedSize}
            className="bg-black text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingToCart ? "ADDING..." : "ADD TO CART"}
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-red-600 text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-red-700 transition-all duration-200"
          >
            BUY NOW
          </button>
        </div>
        )}
      </div>

      {/* BLACK TUESDAY REWARDS - Simple Promotion Box */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="space-y-2 text-sm text-gray-800">
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="font-semibold">BLACK TUESDAY REWARDS</span>
          </div>
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Earn 10% Loyalty points back on any invoice value every Tuesday</span>
          </div>
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Valid from: April 1, 2025</span>
          </div>
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Points expiry: End of the following month (Ex: Points earned on 10/3 will expire on 30/4)</span>
          </div>
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Loyalty points will be credited in addition to your regular membership benefits</span>
          </div>
          <div className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>*Applicable every Tuesday only</span>
          </div>
        </div>
      </div>

      {/* Size Guide Modal (portal to body to escape stacking contexts) */}
      {showSizeGuide && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backgroundColor: 'rgba(107, 114, 128, 0.4)' }} onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">SIZE GUIDE</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-800">FIT | Áo thun</span>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">How to measure:</h3>
                <p className="text-sm text-gray-800 mb-4">
                  Please measure accurately around your waist and chest to determine the correct size based on your body measurements.
                </p>
              </div>
              
              {/* Size Chart */}
              <div>
                <div className="w-full">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left border border-gray-700">SIZE</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XS</th>
                        <th className="px-4 py-3 text-center border border-gray-700">S</th>
                        <th className="px-4 py-3 text-center border border-gray-700">M</th>
                        <th className="px-4 py-3 text-center border border-gray-700">L</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XL</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XXL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Chest (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">43 - 45.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">46 - 48.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">49 - 51.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">52 - 54.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">55 - 56.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">57 - 58.5</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Waist (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">95 - 101</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">102 - 108</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">109 - 114</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">115 - 120</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">121 - 127</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">128 - 132</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Length (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">64 - 66</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">67 - 69</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">70 - 72</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">73 - 75</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">76 - 78</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">79 - 81</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-xs text-gray-700 mt-4">
                  *Size chart is for reference only, please refer to actual product measurements and your individual body measurements for accurate sizing.
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}