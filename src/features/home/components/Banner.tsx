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
    <div className="w-screen relative inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
        <div className="w-full min-h-px flex flex-col justify-start items-start">
          <div className="self-stretch h-[634.98px] relative" ref={emblaRef}>
            <div className="flex h-full">
              {banners.map((banner) => (
                <div key={banner.id} className="flex-[0_0_100%] h-full relative">
                  <img
                    className="w-full h-[634.98px] left-0 top-0 absolute object-cover cursor-pointer"
                    src={banner.image}
                    alt={banner.title}
                    onClick={() => onBannerClick(banner.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Left control */}
      <button
        aria-label="Previous slide"
        onClick={handlePrev}
        className="w-12 h-[46px] left-[40px] top-[288.48px] absolute opacity-50 flex items-center justify-center z-10 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="46" viewBox="0 0 24 46" fill="none">
          <path d="M22.5 43.8335L1.66666 23.0002L22.5 2.16683" stroke="white" strokeWidth="2" strokeLinecap="square"></path>
        </svg>
      </button>

      {/* Right control */}
      <button
        aria-label="Next slide"
        onClick={handleNext}
        className="right-[40px] top-[288.48px] absolute w-12 h-[46px] flex items-center justify-center z-10 opacity-50 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="46" viewBox="0 0 24 46" fill="none">
          <path d="M1.66675 2.1665L22.5001 22.9998L1.66675 43.8332" stroke="white" strokeWidth="2" strokeLinecap="square"></path>
        </svg>
      </button>
    </div>
  );
};
