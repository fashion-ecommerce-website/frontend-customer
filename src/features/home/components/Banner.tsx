'use client';

import React from 'react';
import { Banner as BannerType } from '../types/home.types';

interface BannerProps {
  banners: BannerType[];
  onBannerClick: (bannerId: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ banners, onBannerClick }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${
              index === 0 ? 'lg:col-span-1' : 'lg:col-span-1'
            }`}
            onClick={() => onBannerClick(banner.id)}
          >
            {/* Banner Background */}
            <div className={`
              relative h-64 lg:h-80 p-8 flex flex-col justify-center
              ${index === 0 
                ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
                : 'bg-gradient-to-r from-orange-100 to-orange-200'
              }
            `}>
              {/* Content */}
              <div className={`relative z-10 ${index === 0 ? 'text-white' : 'text-gray-800'}`}>
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
                  <button className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${index === 0 
                      ? 'bg-white text-orange-500 hover:bg-gray-100' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                    }
                  `}>
                    {banner.buttonText}
                  </button>
                )}
              </div>

              {/* Decorative Elements */}
              {index === 0 && (
                <>
                  {/* Palm trees decoration */}
                  <div className="absolute left-4 top-4 text-yellow-300 opacity-60">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C10.9 2 10 2.9 10 4V6.5C8.8 7.1 8 8.4 8 10V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V10C16 8.4 15.2 7.1 14 6.5V4C14 2.9 13.1 2 12 2Z"/>
                    </svg>
                  </div>
                  <div className="absolute right-4 bottom-4 text-yellow-300 opacity-60">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C10.9 2 10 2.9 10 4V6.5C8.8 7.1 8 8.4 8 10V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V10C16 8.4 15.2 7.1 14 6.5V4C14 2.9 13.1 2 12 2Z"/>
                    </svg>
                  </div>
                </>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
