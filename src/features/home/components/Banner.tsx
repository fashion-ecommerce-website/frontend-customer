'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Banner as BannerType } from '../types/home.types';
import useEmblaCarousel from 'embla-carousel-react';

interface BannerProps {
  banners: BannerType[];
  onBannerClick: (bannerId: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ banners, onBannerClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!banners || banners.length === 0) {
    return null;
  }

  if (!mounted) {
    // Avoid SSR/client mismatch by rendering after mount
    return null;
  }

  const handlePrev = () => emblaApi?.scrollPrev();
  const handleNext = () => emblaApi?.scrollNext();

  return (
    <div className="w-full relative overflow-hidden bg-gray-100">
      <div className="relative">
        <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/1] max-h-[400px] sm:max-h-[500px] lg:max-h-[635px]" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner) => (
              <div key={banner.id} className="flex-[0_0_100%] h-full relative">
                <Image
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  src={banner.image}
                  alt={banner.title}
                  onClick={() => onBannerClick(banner.id)}
                  fill
                  sizes="100vw"
                  priority
                />
                {/* Optional overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left control */}
      <button
        aria-label="Previous slide"
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 lg:left-10 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-110"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right control */}
      <button
        aria-label="Next slide"
        onClick={handleNext}
        className="absolute right-2 sm:right-4 lg:right-10 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-110"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
