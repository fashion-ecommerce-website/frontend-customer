'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { useCartActions } from '@/hooks/useCartActions';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { ProductDetail, ProductItem } from '@/services/api/productApi';
import { useRouter } from 'next/navigation';
import { recommendationApi, ActionType } from '@/services/api/recommendationApi';
import { SizeGuideModal, MeasurementsModal, OrderModal } from '@/components/modals';
import { Size } from '@/types/size-recommendation.types';
import { isSizeGuideSupported } from '@/utils/sizeGuideUtils';
import { wishlistApiService } from '@/services/api/wishlistApi';
import { useToast } from '@/providers/ToastProvider';
import { useColorMap } from '@/hooks/useColorMap';
import { useLanguage } from '@/hooks/useLanguage';

interface ProductInfoProps {
  product: ProductDetail;
  selectedColor: string | null;
  selectedSize: string | null;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  isColorLoading?: boolean;
}

export function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  isColorLoading = false,
}: ProductInfoProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const { showError } = useToast();
  const { getColorHex } = useColorMap();
  const { translations } = useLanguage();
  const t = translations.toast;
  const { addToCartWithToast } = useCartActions({
    onSuccess: () => {
      setAddingToCart(false);
    },
    onError: () => {
      setAddingToCart(false);
    }
  });

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showSizeNotice, setShowSizeNotice] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const isAllSizesOut = (() => {
    const quantities = Object.values(product.mapSizeToQuantity || {});
    return quantities.length > 0 && quantities.every((q) => q === 0);
  })();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [, setIsInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  // Check if size guide is supported for this product category
  const showSizeGuideButton = useMemo(() => {
    const result = isSizeGuideSupported(product.categorySlug);
    console.log('🔍 Size Guide Check (useMemo):', {
      categorySlug: product.categorySlug,
      result,
      productTitle: product.title
    });
    return result;
  }, [product.categorySlug, product.title]);


  useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?returnUrl=/products/${product.detailId}`);
      return;
    }
    if (wishlistBusy) return;
    setWishlistBusy(true);
    try {
      // Optimistic update
      setIsInWishlist(prev => !prev);
      const res = await wishlistApiService.toggle(product.detailId);
      if (!res.success) {
        // revert if failed
        setIsInWishlist(prev => !prev);
      } else {
        // confirm by refetching current wishlist state
        const current = await wishlistApiService.getWishlist();
        if (current.success && current.data) {
          const exists = current.data.some(item => item.detailId === product.detailId);
          setIsInWishlist(exists);
        }
      }
    } catch {
      // revert on error
      setIsInWishlist(prev => !prev);
      // console.error('Toggle wishlist failed');
    } finally {
      setWishlistBusy(false);
    }
  }, [isAuthenticated, product.detailId, wishlistBusy, router]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }

    // Validate stock availability
    const availableQty = product.mapSizeToQuantity?.[selectedSize] ?? 0;
    if (availableQty === 0) {
      showError(t.sizeOutOfStock);
      return;
    }

    if (quantity > availableQty) {
      showError(t.onlyXAvailable.replace('{count}', availableQty.toString()));
      return;
    }

    if (!isAuthenticated) {
      // Save cart intent to sessionStorage before redirecting to login
      sessionStorage.setItem('pendingCartAction', JSON.stringify({
        productDetailId: product.detailId,
        sizeName: selectedSize,
        quantity: quantity,
        returnUrl: `/products/${product.detailId}`
      }));
      router.push(`/auth/login?returnUrl=/products/${product.detailId}`);
      return;
    }

    try {
      setAddingToCart(true);

      await addToCartWithToast({
        productDetailId: product.detailId,
        quantity: quantity,
        // Additional data for toast
        productImage: product.images[0] || '/images/placeholder.jpg',
        productTitle: product.title,
        price: product.price,
        finalPrice: product.finalPrice
      });
      try {
        await recommendationApi.recordInteraction(product.productId, ActionType.ADD_TO_CART, quantity);
        console.log('Recorded ADD_TO_CART interaction');
      } catch (error) {
        console.error('Failed to record ADD_TO_CART interaction:', error);
        // Fail silently
      }
    } catch {
      // Error handling is done in the hook
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }

    // Validate stock availability
    const availableQty = product.mapSizeToQuantity?.[selectedSize] ?? 0;
    if (availableQty === 0) {
      showError(t.sizeOutOfStock);
      return;
    }

    if (quantity > availableQty) {
      showError(t.onlyXAvailable.replace('{count}', availableQty.toString()));
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingCartAction', JSON.stringify({
        productDetailId: product.detailId,
        sizeName: selectedSize,
        quantity: quantity,
        returnUrl: `/products/${product.detailId}`,
        isBuyNow: true
      }));
      router.push(`/auth/login?returnUrl=/products/${product.detailId}`);
      return;
    }

    // Record interaction for recommendation system
    try {
      await recommendationApi.recordInteraction(product.productId, ActionType.ADD_TO_CART, quantity);
      console.log('Recorded ADD_TO_CART interaction for Buy Now');
    } catch (error) {
      console.error('Failed to record ADD_TO_CART interaction:', error);
    }

    // Open Buy Now modal directly
    setShowBuyNowModal(true);
  };

  // Create ProductItem for Buy Now modal
  const buyNowProduct: ProductItem = useMemo(
    () => ({
      detailId: product.detailId,
      productTitle: product.title,
      productSlug: product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      price: product.price,
      finalPrice: product.finalPrice ?? product.price,
      percentOff: product.percentOff,
      quantity: quantity,
      colors: product.colors || [],
      colorName: selectedColor || product.activeColor,
      sizeName: selectedSize || product.activeSize || '',
      imageUrls: product.images || [],
    }),
    [product, quantity, selectedColor, selectedSize]
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 md:gap-3">
          {product.finalPrice && product.finalPrice < product.price ? (
            <>
              <div className="text-2xl md:text-3xl font-bold text-black">
                {product.finalPrice.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-lg md:text-xl line-through text-gray-500">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {product.percentOff && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm font-medium">
                  -{product.percentOff}%
                </span>
              )}
            </>
          ) : (
            <div className="text-2xl md:text-3xl font-bold text-black">
              {product.price.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>

      </div>

      {/* Color Selection*/}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2 md:space-y-3 pl-1">
          <h3 className="text-xs md:text-sm font-medium text-gray-900">{translations.product.color}</h3>
          <div className="swatch-color" data-index="option1">
            <div className="flex items-center space-x-2 md:space-x-3 flex-wrap gap-y-2">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`p-[3px] border border-white rounded-full cursor-pointer transition-all duration-200 ${selectedColor === color
                    ? 'shadow-[0_0_1px_1px_#000000]'
                    : 'shadow-[0_0_1px_1px_#e6e6e6]'
                    } ${isColorLoading ? 'pointer-events-none opacity-70' : ''}`}
                  data-color={color}
                  onClick={() => !isColorLoading && onColorSelect(color)}
                >
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Selection */}
      {Object.keys(product.mapSizeToQuantity).length > 0 && (
        <div className="space-y-2 md:space-y-3 relative">
          {/* Size Selection Notice - Positioned above "Choose size" label */}
          <div
            className={`absolute z-10 transition-all duration-250 ease-in-out pointer-events-none ${showSizeNotice
              ? 'opacity-100 visible -top-12 md:-top-16 left-0'
              : 'opacity-0 invisible -top-12 md:-top-16 left-0'
              }`}
            style={{
              filter: 'drop-shadow(0px 0px 10px rgba(46, 46, 46, 0.4))',
              background: '#2E2E2E',
              color: 'white',
              padding: '10px 16px',
              letterSpacing: '1px',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          >
            {translations.product.pleaseSelectSize}
            {/* Tooltip arrow pointing down */}
            <div
              className="absolute -bottom-1 left-4 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #2E2E2E'
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-medium text-gray-900">{translations.product.size}</h3>
            {showSizeGuideButton && (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-[10px] md:text-xs text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7" viewBox="0 0 20 9" fill="none" className="md:w-4 md:h-2">
                  <rect x="0.5" y="0.5" width="19" height="8" rx="0.5" stroke="black"></rect>
                  <rect x="3.5" y="4" width="1" height="4" fill="black"></rect>
                  <rect x="6.5" y="6" width="1" height="2" fill="black"></rect>
                  <rect x="12.5" y="6" width="1" height="2" fill="black"></rect>
                  <rect x="9.5" y="4" width="1" height="4" fill="black"></rect>
                  <rect x="15.5" y="4" width="1" height="4" fill="black"></rect>
                </svg>
                <span>{translations.product.sizeGuide}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(product.mapSizeToQuantity).map(([size, quantity]) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                disabled={quantity === 0}
                className={`w-10 h-8 md:w-12 md:h-9 text-xs md:text-sm font-medium border rounded-full transition-all duration-200 flex items-center justify-center ${selectedSize === size
                  ? 'border-black bg-black text-white'
                  : quantity === 0
                    ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-default'
                    : 'border-gray-300 text-gray-800 hover:border-gray-400 cursor-pointer'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-xs md:text-sm font-medium text-gray-900">{translations.product.quantity}</label>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-8 h-8 md:w-9 md:h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base cursor-pointer"
          >
            −
          </button>
          <span className="w-8 md:w-10 text-center font-medium text-gray-900 text-sm md:text-base">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 md:w-9 md:h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm md:text-base cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {isAllSizesOut ? (
          <div className="w-full h-11 md:h-12 flex items-center justify-center">
            <button
              disabled
              className="w-full h-full text-center uppercase text-xs md:text-sm font-semibold text-gray-500 bg-gray-100 rounded"
            >
              {translations.product.outOfStock}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedSize}
              className="bg-black text-white py-2.5 md:py-3 px-4 md:px-6 font-semibold text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded cursor-pointer"
            >
              {addingToCart ? translations.product.addingToCart : translations.product.addToCart}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-red-600 text-white py-2.5 md:py-3 px-4 md:px-6 font-semibold text-[10px] md:text-xs uppercase tracking-wider hover:bg-red-700 transition-all duration-200 cursor-pointer rounded"
            >
              {translations.product.buyNow}
            </button>
          </div>
        )}
      </div>

      {/* Size Guide Modal - Only show for supported categories */}
      {showSizeGuideButton && (
        <>
          <SizeGuideModal
            isOpen={showSizeGuide}
            onClose={() => setShowSizeGuide(false)}
            category={product.title}
            categorySlug={product.categorySlug}
            productId={product.productId}
            availableSizes={Object.keys(product.mapSizeToQuantity) as Size[]}
            onSizeSelect={(size) => onSizeSelect(size)}
            onAddMeasurements={() => {
              setShowSizeGuide(false);
              setShowMeasurementsModal(true);
            }}
          />

          <MeasurementsModal
            isOpen={showMeasurementsModal}
            onClose={() => setShowMeasurementsModal(false)}
            onSave={() => {
              setShowMeasurementsModal(false);
              setShowSizeGuide(true); // Reopen size guide to show AI recommendations
            }}
            productImage={product.images[0] || '/images/placeholder.jpg'}
          />
        </>
      )}

      {/* Buy Now Order Modal */}
      <OrderModal
        isOpen={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        products={[buyNowProduct]}
        isBuyNow={true}
      />
    </div>
  );
}