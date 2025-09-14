'use client';

import React from 'react';
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
}

export function ProductDetailPresenter({
  product,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
}: ProductDetailPresenterProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Side: Image Gallery + Tabs */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="">
              <div className="grid grid-cols-6 gap-2">
                {/* Small Product Images */}
                <div className="col-span-1">
                  <div className="space-y-2">
                    {product.imageUrls.slice(0, 4).map((image, index) => (
                      <div key={index} className="w-full aspect-square bg-gray-100">
                        <img
                          src={image}
                          alt={`${product.productTitle} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Image */}
                <div className="col-span-5">
                  <div className="relative">
                    {/* Navigation Arrows */}
                    <button className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <div className="aspect-square bg-gray-50">
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                  {product.productTitle}
                </h1>
                {product.styleCode && (
                  <p className="text-sm text-gray-600">
                    Style Code: {product.styleCode}
                  </p>
                )}
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
              onColorSelect={onColorSelect}
              onSizeSelect={onSizeSelect}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <RelatedProducts category={product.category} />
        </div>
      </div>
    </div>
  );
}