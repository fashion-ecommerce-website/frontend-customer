'use client';

import React, { useState, useEffect } from 'react';
import { ProductDetail } from '@/services/api/productApi';
import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
  ProductDetailRecentlyViewed,
} from '.';

interface ProductDetailPresenterProps {
  product: ProductDetail;
  selectedColor: string | null;
  selectedSize: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  isLoading?: boolean;
  onColorChange?: (color: string) => Promise<void>;
}

export function ProductDetailPresenter({
  product,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  isLoading = false,
  onColorChange,
}: ProductDetailPresenterProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const handleImageTransition = (newIndex: number) => {
    if (newIndex === selectedImageIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedImageIndex(newIndex);
      setIsTransitioning(false);
    }, 250);
  };

  const handlePreviousImage = () => {
    const newIndex = selectedImageIndex === 0 ? product.images.length - 1 : selectedImageIndex - 1;
    handleImageTransition(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = selectedImageIndex === product.images.length - 1 ? 0 : selectedImageIndex + 1;
    handleImageTransition(newIndex);
  };

  const handleThumbnailClick = (index: number) => {
    handleImageTransition(index);
  };

  const handleDotClick = (index: number) => {
    handleImageTransition(index);
  };

  // Handle color change with API call
  const handleColorChange = async (color: string) => {
    if (isLoading || color === selectedColor) return;
    
    setSelectedImageIndex(0); // Reset to first image
    
    try {
      if (onColorChange) {
        await onColorChange(color);
      }
      onColorSelect(color);
      onSizeSelect(''); // Clear selected size when color changes
    } catch (error) {
      console.error('Error loading color variant:', error);
    }
  };

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.detailId, selectedColor]);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="mx-auto px-12 max-w-none">
        <div className="grid grid-cols-2 gap-8 py-6">
          {/* Left Side: Image Gallery + Tabs */}
          <div className="space-y-6">
            {/* MLB Korea Style Gallery - Simplified and Fixed */}
            <div className="px-[70px]">
              <ProductImageGallery images={product.images} productTitle={product.title} />
            </div>
            
            {/* Product Details Tabs */}
            <div className="">
              <ProductTabs product={product} />
            </div>
          </div>

          {/* Right Side: Product Information */}
          <div className="pl-[44px] sticky top-0 max-h[620px] overflow-y-auto pr-2">
            {/* Header with Share/Wishlist */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.6969 8.01054C22.1594 8.80179 23.018 9.33333 24.0006 9.33333C25.4734 9.33333 26.6673 8.13943 26.6673 6.66667C26.6673 5.19391 25.4734 4 24.0006 4C22.5279 4 21.334 5.19391 21.334 6.66667C21.334 7.15674 21.4662 7.61594 21.6969 8.01054ZM21.6969 8.01054L10.3044 14.6561M10.3044 14.6561C9.84187 13.8649 8.98334 13.3333 8.00065 13.3333C6.52789 13.3333 5.33398 14.5272 5.33398 16C5.33398 17.4728 6.52789 18.6667 8.00065 18.6667C8.98334 18.6667 9.84187 18.1351 10.3044 17.3439M10.3044 14.6561C10.5351 15.0507 10.6673 15.5099 10.6673 16C10.6673 16.4901 10.5351 16.9493 10.3044 17.3439M10.3044 17.3439L21.6969 23.9895M21.6969 23.9895C22.1594 23.1982 23.018 22.6667 24.0006 22.6667C25.4734 22.6667 26.6673 23.8606 26.6673 25.3333C26.6673 26.8061 25.4734 28 24.0006 28C22.5279 28 21.334 26.8061 21.334 25.3333C21.334 24.8433 21.4662 24.3841 21.6969 23.9895Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#wishlist-svg)">
                      <path d="M15.7232 25.5459L7.37014 17.1929C5.20995 15.0327 5.20995 11.5303 7.37014 9.37014C9.53033 7.20995 13.0327 7.20995 15.1929 9.37014L15.7232 9.90047L16.2535 9.37014C18.4137 7.20995 21.9161 7.20995 24.0763 9.37014C26.2365 11.5303 26.2365 15.0327 24.0763 17.1929L15.7232 25.5459Z" stroke="black" strokeWidth={1.5} strokeLinecap="round"></path>
                    </g>
                    <defs>
                      <clipPath id="wishlist-svg">
                        <rect width="32" height="32" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorSelect={handleColorChange}
              onSizeSelect={onSizeSelect}
              isColorLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category="ao-thun" />

      {/* Recently Viewed Products */}
      <ProductDetailRecentlyViewed />
    </div>
  );
}


