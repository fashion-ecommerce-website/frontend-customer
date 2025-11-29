'use client';

import React, { useEffect, useState } from 'react';
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
    <div className="w-full relative overflow-hidden bg-gray-100 group">
      <div className="relative">
        <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] max-h-[85vh]" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner) => (
              <div key={banner.id} className="flex-[0_0_100%] h-full relative">
                <img
                  className="w-full h-full object-cover"
                  src={banner.image}
                  alt={banner.title}
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-4 tracking-wide opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    {banner.title}
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl font-light mb-8 max-w-2xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    Discover the latest trends in luxury fashion.
                  </p>
                  <button
                    onClick={() => onBannerClick(banner.id)}
                    className="px-8 py-3 bg-white text-black font-semibold text-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        aria-label="Previous slide"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        aria-label="Next slide"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
