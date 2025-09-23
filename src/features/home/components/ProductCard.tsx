'use client';

import React from 'react';
import { Product } from '../types/home.types';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  className = '' 
}) => {
  return (
    <div className={`w-full inline-flex flex-col justify-start items-start gap-[0.01px] cursor-pointer group ${className}`} onClick={() => onProductClick(product.id)}>
      <div className="self-stretch relative flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch relative aspect-[368/456]">
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
  );
};
