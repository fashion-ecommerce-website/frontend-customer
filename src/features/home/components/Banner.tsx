'use client';

import React from 'react';
import { Banner as BannerType } from '../types/home.types';

interface BannerProps {
  banners: BannerType[];
  onBannerClick: (bannerId: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ banners, onBannerClick }) => {
  if (!banners || banners.length === 0) {
    console.log('Banner component: No banners provided');
    return null;
  }

  console.log('Banner component: Rendering banners:', banners);

  return (
    <div className="w-full mb-8">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="relative w-full rounded-lg cursor-pointer"
          onClick={() => onBannerClick(banner.id)}
          style={{
            height: '384px', // lg:h-96
            backgroundImage: `url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Content Overlay */}
          <div 
            className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-8 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="text-white">
              {banner.subtitle && (
                <div className="text-sm font-medium mb-2 opacity-90">
                  {banner.subtitle}
                </div>
              )}
              
              <h2 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
                {banner.title}
              </h2>
              
              {banner.description && (
                <div className="text-lg font-semibold mb-4">
                  {banner.description.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
              
              {banner.buttonText && (
                <button className="px-6 py-3 bg-white text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200">
                  {banner.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
        ))}
    </div>
  );
};
