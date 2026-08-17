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
    <div className="w-full relative overflow-hidden bg-neutral-900">
      <div className="relative">
        <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[380px] max-h-[580px]" ref={emblaRef}>
          <div className="flex h-full">
            {banners.map((banner) => (
              <div key={banner.id} className="flex-[0_0_100%] h-full relative group">
                <Image
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-1000 group-hover:scale-105"
                  src={banner.image}
                  alt={banner.title}
                  onClick={() => onBannerClick(banner.id)}
                  fill
                  sizes="100vw"
                  priority
                />
                
                {/* Modern Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/40 to-transparent flex flex-col justify-end p-6 sm:p-12 lg:p-16">
                  <div className="max-w-4xl space-y-2 sm:space-y-3">
                    <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#C5A880] bg-neutral-900/80 px-3 py-1 rounded-full backdrop-blur-md border border-amber-500/20">
                      {banner.subtitle || 'HAUTE COUTURE 2026'}
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight drop-shadow-md">
                      {banner.title || 'Haute Couture Fashion Collection'}
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-neutral-300 max-w-xl font-light line-clamp-2">
                      Masterpiece designs from Dior, Chanel, Louis Vuitton, Saint Laurent, and Hermès.
                    </p>
                    <div className="pt-2 sm:pt-4">
                      <button
                        onClick={() => onBannerClick(banner.id)}
                        className="inline-flex items-center gap-3 px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold tracking-widest text-neutral-950 uppercase bg-[#C5A880] hover:bg-[#B89762] rounded-full transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-105 cursor-pointer"
                      >
                        Discover Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left control */}
      <button
        aria-label="Previous slide"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-neutral-900/40 hover:bg-neutral-900/80 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:border-amber-400/50 cursor-pointer"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right control */}
      <button
        aria-label="Next slide"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-neutral-900/40 hover:bg-neutral-900/80 backdrop-blur-md rounded-full flex items-center justify-center z-10 border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:border-amber-400/50 cursor-pointer"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
