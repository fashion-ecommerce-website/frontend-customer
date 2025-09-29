'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { recentlyViewedApiService } from '@/services/api/recentlyViewedApi';
import { ProductDetailProps } from '../types';
import { ProductDetailPresenter } from '../components';
import { selectWishlistItems, toggleWishlistRequest } from '@/features/profile/redux/wishlistSlice';
import { useToast } from '@/providers/ToastProvider';
import {
  fetchProductRequest,
  fetchProductByColorRequest,
  setSelectedColor,
  setSelectedSize,
  resetProductDetail,
} from '../redux/productDetailSlice';

export function ProductDetailContainer({ productId }: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { product, isLoading, error, selectedColor, selectedSize, isColorLoading } = useAppSelector(
    (state) => state.productDetail
  );
  const wishlistItems = useAppSelector((state) => selectWishlistItems(state as any));
  const { showSuccess, showError } = useToast();

  // Handle color change with Redux action
  const handleColorChange = async (color: string) => {
    // Dispatch action to fetch product by color (include current selected size if present)
    dispatch(fetchProductByColorRequest({ id: productId, color, size: selectedSize || undefined }));
  };

  // Handle color selection (local UI state)
  const handleColorSelect = (color: string) => {
    dispatch(setSelectedColor(color));
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    dispatch(setSelectedSize(size));
    // Only refetch when user selects a concrete size (non-empty)
    if (size) {
      const colorToUse = selectedColor || product?.activeColor || product?.colors?.[0];
      if (colorToUse) {
        dispatch(fetchProductByColorRequest({ id: productId, color: colorToUse, size }));
      }
    }
  };

  useEffect(() => {
    // Fetch product data when productId changes
    dispatch(fetchProductRequest(productId));
  }, [productId, dispatch]);

  // Add product to recently viewed when product is loaded successfully
  useEffect(() => {
    const addToRecentlyViewed = async () => {
      // Only add if user is authenticated and product is loaded
      if (isAuthenticated && product && product.detailId) {
        try {
          console.log('🔍 Adding product to recently viewed:', product.detailId);
          await recentlyViewedApiService.addRecentlyViewed(product.detailId);
          console.log('✅ Successfully added to recently viewed');
        } catch (error) {
          console.error('❌ Failed to add to recently viewed:', error);
          // Fail silently - don't show error to user for this background operation
        }
      }
    };

    addToRecentlyViewed();
  }, [product, isAuthenticated]); // Trigger when product or auth status changes

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(resetProductDetail());
    };
  }, [dispatch]);


  // Only show error if there's actually an error, not just no product yet
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Show empty/loading state while waiting for product
  if (!product) {
    return <div className="min-h-screen bg-white"></div>;
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
      isInWishlist={wishlistItems.some((i) => i.productTitle === product.title && i.colorName === product.activeColor)}
      wishlistBusy={false}
      onToggleWishlist={() => {
        if (!isAuthenticated) {
          window.location.href = `/auth/login?returnUrl=/products/${product.detailId}`;
          return;
        }
        const existingSameColor = wishlistItems.find((i) => i.productTitle === product.title && i.colorName === product.activeColor);
        const isOn = !!existingSameColor;
        // Dispatch toggle for target detail
        dispatch(toggleWishlistRequest(isOn ? existingSameColor!.detailId : product.detailId));
        // Immediately refresh via fetch to ensure state sync with server
        dispatch({ type: 'wishlist/fetchWishlistRequest' });
        showSuccess(isOn ? 'Removed from wishlist' : 'Added to wishlist');
      }}
    />
  );
}