'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { ProductDetailProps } from '../types';
import { ProductDetailPresenter } from '.';
import { ProductDetailSkeleton } from '../components';
import {
  fetchProductRequest,
  fetchProductByColorRequest,
  setSelectedColor,
  setSelectedSize,
  resetProductDetail,
} from '../redux/productDetailSlice';

export function ProductDetailContainer({ productId }: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const { product, isLoading, error, selectedColor, selectedSize, isColorLoading } = useAppSelector(
    (state) => state.productDetail
  );

  // Handle color change with Redux action
  const handleColorChange = async (color: string) => {
    // Dispatch action to fetch product by color
    dispatch(fetchProductByColorRequest({ id: productId, color }));
  };

  // Handle color selection (local UI state)
  const handleColorSelect = (color: string) => {
    dispatch(setSelectedColor(color));
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    dispatch(setSelectedSize(size));
  };

  useEffect(() => {
    // Clean up previous state when productId changes
    dispatch(resetProductDetail());
    
    // Fetch product data
    dispatch(fetchProductRequest(productId));
  }, [productId, dispatch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(resetProductDetail());
    };
  }, [dispatch]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || 'Product not found'}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPresenter
      product={product}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
      onColorSelect={handleColorSelect}
      onSizeSelect={handleSizeSelect}
      onColorChange={handleColorChange}
      isLoading={isColorLoading} // Pass color loading state
    />
  );
}