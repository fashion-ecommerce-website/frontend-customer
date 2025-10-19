"use client";

import React from 'react';
import { VirtualTryOnContainer } from '@/features/virtual-tryon';
import { VirtualTryOnProduct } from '@/features/virtual-tryon/types';
import { useAppSelector } from '@/hooks/redux';
import { selectCartItems } from '@/features/cart/redux/cartSlice';

export default function VirtualTryOnPage() {
  const cartItems = useAppSelector(selectCartItems);
  
  // Transform cart items to virtual try-on products
  const products: VirtualTryOnProduct[] = cartItems.map(item => ({
    id: item.id,
    productDetailId: item.productDetailId,
    productTitle: item.productTitle,
    colorName: item.colorName,
    sizeName: item.sizeName,
    imageUrl: item.imageUrl,
    price: item.price,
  }));

  return <VirtualTryOnContainer products={products} />;
}
