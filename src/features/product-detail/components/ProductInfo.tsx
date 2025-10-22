 'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '@/hooks/redux';
import { useCartActions } from '@/hooks/useCartActions';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { ProductDetail } from '@/services/api/productApi';
import { wishlistApiService } from '@/services/api/wishlistApi';
import { useRouter } from 'next/navigation';

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
  const { addToCartWithToast } = useCartActions({
    onSuccess: () => {
      setAddingToCart(false);
    },
    onError: () => {
      setAddingToCart(false);
    }
  });

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSizeNotice, setShowSizeNotice] = useState(false);
  const isAllSizesOut = (() => {
    const quantities = Object.values(product.mapSizeToQuantity || {});
    return quantities.length > 0 && quantities.every((q) => q === 0);
  })();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  // Initialize wishlist state for this product
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await wishlistApiService.getWishlist();
        if (mounted && res.success && res.data) {
          // Debug: log current wishlist ids
          // console.debug('Wishlist get success', res.data.map(i => i.detailId));
          setIsInWishlist(res.data.some(item => item.detailId === product.detailId));
        }
      } catch {
        // ignore initial load errors for wishlist state
      }
    };
    if (isAuthenticated) init(); else setIsInWishlist(false);
    return () => { mounted = false; };
  }, [isAuthenticated, product.detailId]);

  const handleToggleWishlist = useCallback(async () => {
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
    } catch (e) {
      // revert on error
      setIsInWishlist(prev => !prev);
      // console.error('Toggle wishlist failed', e);
    } finally {
      setWishlistBusy(false);
    }
  }, [isAuthenticated, product.detailId, isInWishlist, wishlistBusy, router]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to add items to cart');
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
        price: product.price
      });
    } catch (error) {
      // Error handling is done in the hook
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000); // Hide after 3 seconds
      return;
    }
    // Buy now logic here
    console.log('Buy now:', { product: product.detailId, color: selectedColor, size: selectedSize });
  };

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {product.finalPrice && product.finalPrice < product.price ? (
            <>
              <div className="text-3xl font-bold text-black">
                {product.finalPrice.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-xl line-through text-gray-500">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {product.percentOff && (
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                  -{product.percentOff}%
                </span>
              )}
            </>
          ) : (
            <div className="text-3xl font-bold text-black">
              {product.price.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>
       
      </div>

      {/* Color Selection*/}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 pl-1">
          <div className="swatch-color" data-index="option1">
            <div className="flex items-center space-x-3">
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
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() === 'white' ? '#e6e6e6' : color.toLowerCase() }}
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
        <div className="space-y-3 relative">
          {/* Size Selection Notice - Positioned above "Choose size" label */}
          <div
            className={`absolute z-10 transition-all duration-250 ease-in-out pointer-events-none ${showSizeNotice
              ? 'opacity-100 visible -top-16 left-0'
              : 'opacity-0 invisible -top-16 left-0'
              }`}
            style={{
              filter: 'drop-shadow(0px 0px 10px rgba(46, 46, 46, 0.4))',
              background: '#2E2E2E',
              color: 'white',
              padding: '12px 19px',
              letterSpacing: '1px',
              borderRadius: '4px'
            }}
          >
            Please select size
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
            <h3 className="text-sm font-medium text-gray-900">Choose size</h3>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-gray-800 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="9" viewBox="0 0 20 9" fill="none">
                <rect x="0.5" y="0.5" width="19" height="8" rx="0.5" stroke="black"></rect>
                <rect x="3.5" y="4" width="1" height="4" fill="black"></rect>
                <rect x="6.5" y="6" width="1" height="2" fill="black"></rect>
                <rect x="12.5" y="6" width="1" height="2" fill="black"></rect>
                <rect x="9.5" y="4" width="1" height="4" fill="black"></rect>
                <rect x="15.5" y="4" width="1" height="4" fill="black"></rect>
              </svg>
              <span>Size guide</span>
            </button>
          </div>

          <div className="flex space-x-3">
            {Object.entries(product.mapSizeToQuantity).map(([size, quantity]) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                disabled={quantity === 0}
                className={`w-14 h-10 text-sm font-medium border rounded-full transition-all duration-200 flex items-center justify-center ${selectedSize === size
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
        <label className="text-sm font-medium text-gray-800">Quantity</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAllSizesOut ? (
          <div className="w-full h-14 flex items-center justify-center mt-6">
            <button
              disabled
              className="w-full h-full text-center uppercase text-base font-normal text-black font-bold bg-gray-100"
            >
              Out of stock
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedSize}
              className="bg-black text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-red-600 text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-red-700 transition-all duration-200 cursor-pointer"
            >
              BUY NOW
            </button>
          </div>
        )}
      </div>

      {/* BLACK TUESDAY REWARDS - Simple Promotion Box */}
      <div className="w-full px-[10px] py-3 bg-[#fafafa] border border-[#dfdfdf] rounded relative mt-2.5 mb-2.5 inline-flex flex-col justify-start items-start">
        <div className="self-stretch pl-4 flex flex-col justify-center items-start">
          <div className="self-stretch relative flex flex-col justify-start items-start">
            <div className="w-3 h-7 left-[-20px] top-0 absolute justify-center text-[#202846] text-sm font-normal font-['Products Sans'] leading-loose">◈</div>
            <div className="justify-center text-[#202846] text-sm font-bold font-['Products Sans'] leading-loose">BLACK TUESDAY REWARDS</div>
          </div>

          <div className="justify-center text-[#202846] text-sm font-normal font-['Products Sans'] leading-loose">
            Earn 10% Loyalty points back on any invoice value every Tuesday<br />
            Valid from: April 1, 2025<br />
            Points expiry: End of the following month (Ex: Points earned on 10/3 will expire on 30/4)<br />
            Loyalty points will be credited in addition to your regular membership benefits<br />
            *Applicable every Tuesday only
          </div>
        </div>
      </div>

      {/* Size Guide Modal (portal to body to escape stacking contexts) */}
      {showSizeGuide && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backgroundColor: 'rgba(107, 114, 128, 0.4)' }} onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">SIZE GUIDE</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-800">FIT | Áo thun</span>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">How to measure:</h3>
                <p className="text-sm text-gray-800 mb-4">
                  Please measure accurately around your waist and chest to determine the correct size based on your body measurements.
                </p>
              </div>

              {/* Size Chart */}
              <div>
                <div className="w-full">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-left border border-gray-700">SIZE</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XS</th>
                        <th className="px-4 py-3 text-center border border-gray-700">S</th>
                        <th className="px-4 py-3 text-center border border-gray-700">M</th>
                        <th className="px-4 py-3 text-center border border-gray-700">L</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XL</th>
                        <th className="px-4 py-3 text-center border border-gray-700">XXL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Chest (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">43 - 45.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">46 - 48.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">49 - 51.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">52 - 54.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">55 - 56.5</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">57 - 58.5</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Waist (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">95 - 101</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">102 - 108</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">109 - 114</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">115 - 120</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">121 - 127</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">128 - 132</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 font-medium bg-gray-50 border border-gray-200 text-gray-900">Length (cm)</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">64 - 66</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">67 - 69</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">70 - 72</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">73 - 75</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">76 - 78</td>
                        <td className="px-4 py-3 text-center border border-gray-200 text-gray-900">79 - 81</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-700 mt-4">
                  *Size chart is for reference only, please refer to actual product measurements and your individual body measurements for accurate sizing.
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}