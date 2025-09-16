'use client';

import React, { useState, useEffect } from 'react';
import { ProductDetail } from '@/services/api/productApi';
import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
} from '../components';

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
  // Removed local isColorLoading state - using Redux state via isLoading prop
  
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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Side: Image Gallery + Tabs */}
          <div className="space-y-6">
            {/* MLB Korea Style Gallery - Simplified and Fixed */}
            <div className="">
              <div className="flex gap-4 items-start">
                {/* Thumbnail Sidebar - Left Side */}
                <div className="wrapper-list-thumb-image-detail w-24 flex-shrink-0">
                  <div 
                    className="list-thumb-image-detail flex flex-col space-y-2 overflow-y-auto overflow-x-hidden" 
                    style={{
                      height: '616px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#9CA3AF transparent'
                    }}
                  >
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`item-image-detail w-24 h-24 bg-white border transition-all duration-200 hover:border-gray-400 cursor-pointer ${
                          selectedImageIndex === index ? 'active border-black border-2' : 'border-gray-200'
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                        data-image={image}
                      >
                        <img
                          src={image}
                          alt={`${product.title} view ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Carousel - Right Side */}
                <div className="flex-1 relative">
                  {/* Navigation Arrows - Inverted Colors */}
                  <button 
                    onClick={handlePreviousImage}
                    disabled={isTransitioning}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-transparent rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="46" viewBox="0 0 24 46" fill="none">
                      <path d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683" stroke="black" strokeWidth="2" strokeLinecap="square"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={handleNextImage}
                    disabled={isTransitioning}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-transparent rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="46" viewBox="0 0 24 46" fill="none">
                      <path d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332" stroke="black" strokeWidth="2" strokeLinecap="square"></path>
                    </svg>
                  </button>

                  {/* Main Image Display - Clean without loading overlay */}
                  <div className="aspect-square bg-white relative overflow-hidden border border-gray-200">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                      loading="eager"
                      onLoad={() => {
                        // Smooth transition when image loads
                      }}
                    />
                  </div>

                  {/* Dot Pagination */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        disabled={isTransitioning}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          selectedImageIndex === index 
                            ? 'bg-black' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      >
                        <span className="sr-only">Go to image {index + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="">
              <ProductTabs product={product} />
            </div>
          </div>

          {/* Right Side: Product Information */}
          <div className="">
            {/* Header with Share/Wishlist */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <RelatedProducts category="ao-thun" />
        </div>
      </div>
    </div>
  );
}