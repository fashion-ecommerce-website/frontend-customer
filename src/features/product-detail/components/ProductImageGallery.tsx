'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fallback image if no images available
  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
  });

  // Sync selected index with Embla
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const snap = emblaApi.selectedScrollSnap();
      setSelectedImageIndex(snap);
    };
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="">
      <div className="flex gap-4 items-start">
        {/* Left: Vertical Thumbnails */}
        {displayImages.length > 1 && (
          <div className="w-24 flex-shrink-0">
            <div
              className="flex flex-col space-y-2 overflow-y-auto overflow-x-hidden"
              style={{ height: '616px', scrollbarWidth: 'thin' }}
            >
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`relative w-24 h-24 overflow-hidden border transition-all duration-200 ${selectedImageIndex === index ? 'border-black border-2' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  title={`Thumbnail ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${productTitle} - View ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right: Embla Viewport */}
        <div className="flex-1 relative">
          {/* Nav arrows (hidden on mobile) */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={scrollPrev}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-transparent hover:bg-transparent shadow-none ring-0 backdrop-blur-0 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 46" fill="none">
                  <path d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683" stroke="black" strokeWidth="2" strokeLinecap="square">
                  </path>
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={scrollNext}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-transparent hover:bg-transparent shadow-none ring-0 backdrop-blur-0 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 46" fill="none">
                  <path d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332" stroke="black" strokeWidth="2" strokeLinecap="square">
                  </path>
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden bg-white aspect-[4/5]" ref={emblaRef}>
            <div className="flex h-full">
              {displayImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 h-full">
                  <Image
                    src={image}
                    alt={`${productTitle} - View ${index + 1}`}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots for mobile */}
          {displayImages.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 md:hidden">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedImageIndex === index ? 'bg-black' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}