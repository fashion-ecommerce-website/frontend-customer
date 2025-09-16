'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fallback image if no images available
  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-white overflow-hidden">
        <Image
          src={displayImages[selectedImageIndex]}
          alt={productTitle}
          width={600}
          height={600}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`${productTitle} - View ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Navigation for Mobile */}
      {displayImages.length > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                selectedImageIndex === index ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}