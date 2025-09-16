'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { recentlyViewedApiService } from '@/services/api/recentlyViewedApi';

interface RecentlyViewedItem {
  detailId: number;
  price: number;
  originalPrice?: number; // For discount calculation
  quantity: number;
  colors: string[];
  imageUrls: string[];
  colorName: string;
  productTitle: string;
  productSlug: string;
}

export function ProductDetailRecentlyViewed() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Helper function to get color hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF', 
      'gray': '#6B7280',
      'grey': '#6B7280',
      'olive': '#6B7F5E',
      'cream': '#F5F5DC',
      'light blue': '#87CEEB',
      'blue': '#3B82F6',
      'dark blue': '#1E3A8A',
      'navy': '#1E3A8A',
      'red': '#DC2626',
      'pink': '#EC4899',
      'green': '#059669',
      'yellow': '#EAB308',
      'brown': '#92400E',
      'beige': '#F5F5DC',
      'purple': '#7C3AED',
      'orange': '#EA580C',
    };
    return colorMap[colorName.toLowerCase()] || '#9CA3AF';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };
  
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          console.log('🔍 Fetching recently viewed items...');
          const response = await recentlyViewedApiService.getRecentlyViewed();
          
          if (response.success && response.data) {
            console.log('✅ Recently viewed items fetched:', response.data.length);
            // Transform API data to include originalPrice for discount calculation
            const transformedItems = response.data.map(item => ({
              ...item,
              originalPrice: Math.round(item.price * 1.3) // Mock 30% discount for demo
            }));
            setItems(transformedItems);
          } else {
            throw new Error(response.message || 'Error fetching recently viewed');
          }
        } catch (error) {
          console.error('❌ Failed to fetch recently viewed:', error);
          // Fallback to mock data on error
          setItems(getMockData());
        } finally {
          setLoading(false);
        }
      } else {
        // Show mock data for non-authenticated users
        console.log('🔍 User not authenticated, showing mock data');
        setItems(getMockData());
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);

  const getMockData = (): RecentlyViewedItem[] => [
    {
      detailId: 1,
      price: 1050000,
      originalPrice: 1790000,
      quantity: 13,
      colors: ["cream", "white"],
      imageUrls: [
        "https://cdn.hstatic.net/products/200000642007/50nys_3atsm0754_1_23b21611ba6d40b4bb3388972db5503e_a091f84c244a4731af6a276ba74d20ad_master.jpg",
        "https://cdn.hstatic.net/products/200000642007/50nys_3atsm0754_3_23b21611ba6d40b4bb3388972db5503e_a091f84c244a4731af6a276ba74d20ad_master.jpg"
      ],
      colorName: "cream",
      productTitle: "MLB - Short-Sleeve Unisex Cute Graphic T-Shirt",
      productSlug: "mlb-short-sleeve-unisex-cute-graphic-t-shirt"
    },
    {
      detailId: 2,
      price: 1150000,
      originalPrice: 1990000,
      quantity: 13,
      colors: ["black", "dark blue", "white"],
      imageUrls: [
        "https://cdn.hstatic.net/products/200000642007/50bks_3atsb0754_1_2167da6328ad4e85a55f1937a43dbaa8_ba5221d9071b4de4bfdfd569a316daf3_master.jpg",
        "https://cdn.hstatic.net/products/200000642007/50nys_3atsm0754_1_23b21611ba6d40b4bb3388972db5503e_a091f84c244a4731af6a276ba74d20ad_master.jpg"
      ],
      colorName: "black",
      productTitle: "MLB - Unisex Round Neck Short Sleeve Classic Monogram T-Shirt",
      productSlug: "mlb-unisex-round-neck-short-sleeve-classic-monogram"
    },
    {
      detailId: 3,
      price: 1390000,
      originalPrice: 1890000,
      quantity: 13,
      colors: ["olive", "black", "white"],
      imageUrls: [
        "https://cdn.hstatic.net/products/200000642007/50ivs_3atsv0554_1_41a9901958e2417ca520038755f6214b_95449c11956540e59f86036fe642ea4a_master.jpg",
        "https://cdn.hstatic.net/products/200000642007/50ivs_3atsv0554_3_bb6807a3f69749068697decf3f90c82d_67d53f1ca72a4c9f9e1c16dc4e5bfd59_master.jpg"
      ],
      colorName: "olive",
      productTitle: "MLB - Áo thun unisex tay ngắn Basic Mega Logo",
      productSlug: "mlb-ao-thun-unisex-basic-mega-logo"
    },
    {
      detailId: 4,
      price: 1890000,
      originalPrice: 2290000,
      quantity: 13,
      colors: ["white", "gray"],
      imageUrls: [
        "https://cdn.hstatic.net/products/200000642007/50nys_3atsm0754_1_23b21611ba6d40b4bb3388972db5503e_a091f84c244a4731af6a276ba74d20ad_master.jpg",
        "https://cdn.hstatic.net/products/200000642007/50nys_3atsm0754_2_23b21611ba6d40b4bb3388972db5503e_a091f84c244a4731af6a276ba74d20ad_master.jpg"
      ],
      colorName: "white",
      productTitle: "MLB - Women's Short Sleeve Polo Shirt with Varsity Zip Detail",
      productSlug: "mlb-womens-short-sleeve-polo-shirt-varsity-zip"
    },
    {
      detailId: 5,
      price: 3890000,
      originalPrice: 4590000,
      quantity: 13,
      colors: ["light blue", "white"],
      imageUrls: [
        "https://cdn.hstatic.net/products/200000642007/50ivs_3atsv0554_2_bb6807a3f69749068697decf3f90c82d_67d53f1ca72a4c9f9e1c16dc4e5bfd59_master.jpg",
        "https://cdn.hstatic.net/products/200000642007/50ivs_3atsv0554_1_41a9901958e2417ca520038755f6214b_95449c11956540e59f86036fe642ea4a_master.jpg"
      ],
      colorName: "light blue",
      productTitle: "MLB - Women's Short Sleeve Polo Shirt with Varsity Zip Detail",
      productSlug: "mlb-womens-short-sleeve-polo-shirt-varsity-zip-blue"
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <div className="relative">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 pb-2">Recently Viewed</h2>
            </div>
          </div>
          
          {/* Full width underline */}
          <div className="w-full h-0.5 bg-black mb-6 md:mb-8"></div>
          
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide pb-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-none w-48 md:w-64">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-square bg-gray-300 animate-pulse"></div>
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="h-3 md:h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 md:h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="flex space-x-1">
                      <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 pb-2">Recently Viewed</h2>
          </div>
        </div>
        
        {/* Full width underline */}
        <div className="w-full h-0.5 bg-black mb-6 md:mb-8"></div>
        
        {/* Navigation container with side buttons */}
        <div className="relative">
          {/* Left navigation button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm hidden md:flex"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right navigation button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm hidden md:flex"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        
        {/* Horizontal scrolling container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div key={item.detailId} className="flex-none w-48 md:w-64">
              <Link href={`/products/${item.detailId}`}>
                <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {/* Main Image */}
                    <Image
                      src={item.imageUrls[0]}
                      alt={item.productTitle}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        item.imageUrls[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                      }`}
                      sizes="(max-width: 768px) 192px, 256px"
                    />
                    
                    {/* Back Image - appears on hover (only if exists) */}
                    {item.imageUrls[1] && (
                      <Image
                        src={item.imageUrls[1]}
                        alt={`${item.productTitle} - back view`}
                        fill
                        className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100"
                        sizes="(max-width: 768px) 192px, 256px"
                        onError={(e) => {
                          // Hide back image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Discount Badge */}
                    {item.originalPrice && (
                      <div className="absolute top-2 md:top-3 left-2 md:left-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                          -{calculateDiscount(item.price, item.originalPrice)}%
                        </span>
                      </div>
                    )}
                    
                    {/* Cart icon */}
                    <button className="absolute top-2 md:top-3 right-2 md:right-3 w-7 md:w-8 h-7 md:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm">
                      <svg className="w-3.5 md:w-4 h-3.5 md:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 104 0m4 0a2 2 0 104 0" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {item.productTitle}
                    </h3>
                    
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-sm md:text-lg font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Color Dots */}
                    <div className="flex items-center space-x-1">
                      {item.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full border border-gray-200 flex-shrink-0"
                          style={{ 
                            backgroundColor: getColorHex(color),
                            borderColor: color.toLowerCase() === 'white' ? '#E5E7EB' : 'transparent'
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        </div> {/* Close navigation container */}
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}