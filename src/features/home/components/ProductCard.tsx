'use client';

import React from 'react';
import { Product } from '../types/home.types';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  className?: string;
  showBadgeOnImage?: boolean; // true for New Arrivals, false for Ranking
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  className = '',
  showBadgeOnImage = false
}) => {
  return (
    <div className={`w-full inline-flex flex-col justify-start items-start gap-[0.01px] cursor-pointer group ${className}`} onClick={() => onProductClick(product.id)}>
      <div className="self-stretch relative flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch relative aspect-[368/456]">
          {/* Promotion Badge - only show on image for New Arrivals */}
          {showBadgeOnImage && product.percentOff && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold rounded shadow-lg w-10 h-6 flex items-center justify-center">
              -{product.percentOff}%
            </div>
          )}
          
          <img className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" src={(product.images && product.images[0]) ? product.images[0] : product.image} alt={product.name} />
          {product.images && product.images[1] && (
            <img className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" src={product.images[1]} alt={`${product.name} hover`} />
          )}
        </div>
        <div className="w-10 h-10 right-4 top-4 absolute bg-black/10 rounded-[40px] inline-flex justify-center items-center">
          <img src="https://file.hstatic.net/200000642007/file/shopping-cart_3475f727ea204ccfa8fa7c70637d1d06.svg" alt="Cart" className="w-6 h-6" />
        </div>
      </div>
      <div className="self-stretch px-2.5 py-4 bg-white flex flex-col justify-start items-start gap-4">
        <div className="self-stretch min-h-12 flex flex-col justify-start items-start overflow-hidden">
          <div className="inline-flex justify-start items-start">
            <div className="justify-center text-black text-base font-normal leading-normal font-['SVN-Product_Sans']">{product.name}</div>
          </div>
        </div>
        <div className="self-stretch flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {product.finalPrice && product.finalPrice < product.price ? (
              <>
                <span className="text-sm font-semibold text-red-600">
                  {product.finalPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xs line-through text-gray-500">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                {/* Badge promotion next to price - only for Ranking */}
                {!showBadgeOnImage && product.percentOff && (
                  <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    -{product.percentOff}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-semibold text-black">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="self-stretch inline-flex justify-start items-center gap-2 flex-wrap content-center">
              {product.colors.slice(0, 3).map((color) => (
                <div key={color} className="w-3 h-3 rounded-xl flex justify-center items-center overflow-hidden">
                  <div className="w-3 h-3 rounded-xl" style={{
                    backgroundColor: color === 'white' ? '#ffffff' :
                                     color === 'black' ? '#000000' :
                                     color === 'beige' ? '#F5F5DC' :
                                     color === 'navy' ? '#001f3f' :
                                     color === 'gray' ? '#808080' : color
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
