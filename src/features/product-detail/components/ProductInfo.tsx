'use client';

import React, { useState } from 'react';
import { ProductDetail } from '@/services/api/productApi';

interface ProductInfoProps {
  product: ProductDetail;
  selectedColor: string | null;
  selectedSize: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
}

export function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
}: ProductInfoProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-black">
          {formatPrice(product.price)}
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="text-lg text-gray-500 line-through">
            {formatPrice(product.originalPrice)}
          </div>
        )}
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorSelect(color)}
                  className={`w-10 h-10 rounded-full border-4 ring-2 ring-white transition-all duration-200 ${
                    selectedColor === color
                      ? 'border-black'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Choose size</h3>
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
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`px-4 py-2 text-sm font-medium border rounded-full transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-800 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            className="bg-black text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            disabled={!product.isInStock}
          >
            ADD TO CART
          </button>
          <button
            className="bg-red-600 text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
            disabled={!product.isInStock}
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3">
        <ul className="space-y-2 text-sm text-gray-800">
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>MLB Clothes Sale over 9%</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Join our community for exclusive member benefits and styling tips</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Premium cotton fabric, breathable and comfortable for active wear</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span className="font-semibold">BLACK TUESDAY REWARDS</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Get 10% OFF LOYALTY points every Tuesday</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Apply with OTALO code</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Special Tuesday discounts for loyalty members</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Use Loyalty points within the valid period for maximum savings</span>
          </li>
          <li className="flex items-start">
            <span className="text-black mr-2">•</span>
            <span>Don't miss our weekly Tuesday specials</span>
          </li>
        </ul>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(107, 114, 128, 0.4)' }} onClick={() => setShowSizeGuide(false)}>
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
        </div>
      )}
    </div>
  );
}