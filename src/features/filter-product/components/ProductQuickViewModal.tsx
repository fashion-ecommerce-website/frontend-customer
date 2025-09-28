"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useCartActions } from "@/hooks/useCartActions";
import { selectIsAuthenticated } from "@/features/auth/login/redux/loginSlice";
import { productApi, ProductDetail } from "@/services/api/productApi";
import {
  fetchProductByColorRequest,
  setSelectedSize as setSelectedSizeAction,
} from '@/features/product-detail/redux/productDetailSlice';

interface ProductQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  currentSize?: string; // Size hiện tại trong cart (optional)
  // Edit mode props
  isEditMode?: boolean;
  // The cart item id being edited (so caller can identify which cart item to update)
  cartItemId?: number;
  // Current quantity for the cart item when opening in edit mode
  currentQuantity?: number;
  // Callback invoked when user confirms edit. Receives { cartItemId, productDetailId, sizeName, quantity }
  onConfirmEdit?: (payload: { cartItemId?: number; productDetailId?: number; sizeName?: string; quantity?: number }) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  isOpen,
  onClose,
  productId,
  currentSize,
  isEditMode,
  cartItemId,
  currentQuantity,
  onConfirmEdit,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { addToCartWithToast } = useCartActions({
    onSuccess: () => {
      setAddingToCart(false);
      onClose(); // Close modal after successful add
    },
    onError: () => {
      setAddingToCart(false);
    }
  });
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  // Local selected size state (renamed to avoid colliding with Redux action name)
  const [selectedSizeLocal, setSelectedSizeLocal] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeNotice, setShowSizeNotice] = useState(false);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [colorPreviewImages, setColorPreviewImages] = useState<{[color: string]: string}>({});
  // Request token to ignore stale variant/color responses
  const variantRequestIdRef = useRef(0);
  // When true, the next product change should not trigger preview refetch or reset UI
  const suppressProductChangeEffectsRef = useRef(false);

  // Handle escape key to close modal - MOVED UP
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Get display images with fallback
  const displayImages = product?.images && product.images.length > 0 
    ? product.images 
    : ['/images/placeholder-product.jpg'];

  // Fetch product detail when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetail();
      // Reset quantity when modal opens
      // Default amount to 1 unless editing an existing cart item with a provided quantity
      if (!(isEditMode && typeof currentQuantity === 'number')) {
        setSelectedAmount(1);
      } else {
        setSelectedAmount(Math.max(1, currentQuantity));
      }
    }
  }, [isOpen, productId]);

  // If modal opened for edit, preselect size from prop when product loads
  useEffect(() => {
    if (isOpen && isEditMode && currentSize) {
      setSelectedSizeLocal(currentSize);
    }
  }, [isOpen, isEditMode, currentSize]);

  // Prefill amount when opening in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && typeof currentQuantity === 'number') {
      setSelectedAmount(Math.max(1, currentQuantity));
    }
  }, [isOpen, isEditMode, currentQuantity]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.activeColor || product.colors[0] || "");

      // If this product change was caused by an internal variant fetch (size selection),
      // skip resetting the UI and avoid re-fetching preview images which would cause
      // additional API calls. Otherwise, perform the normal reset logic.
      if (suppressProductChangeEffectsRef.current) {
        // Clear the suppress flag for subsequent product changes
        suppressProductChangeEffectsRef.current = false;
      } else {
        // Set size từ cart nếu có, nếu không thì để trống
        setSelectedSizeLocal(currentSize || "");
        setSelectedImageIndex(0);
        setShowSizeNotice(false);
        // Reset quantity to 1 when product changes, except preserve edit-mode initial quantity
        if (!(isEditMode && typeof currentQuantity === 'number')) {
          setSelectedAmount(1);
        } else {
          setSelectedAmount(Math.max(1, currentQuantity));
        }
        // Don't reset image loading states - let images load naturally

        // Fetch color preview images
        fetchColorPreviewImages();
      }
    }
  }, [product, currentSize]);

  // Simplified preload effect - avoid complex dependencies
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      // Preload first two images immediately when product loads
      const firstImage = product.images[0];
      if (firstImage) {
        preloadImage(firstImage, 0);
      }
      
      if (product.images.length > 1) {
        const secondImage = product.images[1];
        setTimeout(() => preloadImage(secondImage, 1), 100);
      }
    }
  }, [product?.images]);

  // Preload adjacent images when user changes selection
  useEffect(() => {
    if (product?.images && product.images.length > 1) {
      const nextIndex = selectedImageIndex + 1;
      const prevIndex = selectedImageIndex - 1;
      
      if (nextIndex < product.images.length) {
        setTimeout(() => preloadImage(product.images[nextIndex], nextIndex), 50);
      }
      
      if (prevIndex >= 0) {
        setTimeout(() => preloadImage(product.images[prevIndex], prevIndex), 50);
      }
    }
  }, [selectedImageIndex, product?.images]);

  const fetchProductDetail = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await productApi.getProductById(productId.toString());
      if (response.data) {
        // Set product (don't suppress product-change effects here - we want
        // the product useEffect to run so color preview images are fetched
        // when the modal opens).
        setProduct(response.data);

        // Immediately preload first image after setting product
        if (response.data.images && response.data.images.length > 0) {
          const firstImage = response.data.images[0];
          if (firstImage) {
            preloadImage(firstImage, 0);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch color preview images
  const fetchColorPreviewImages = async () => {
    if (!productId || !product?.colors) return;

    const previewImages: {[color: string]: string} = {};

    // Build an array of promises to fetch each color variant in parallel
    const colorPromises = product.colors.map(async (color) => {
      if (color === product.activeColor) {
        // Use current product's first image for active color
        if (product.images && product.images.length > 0) {
          previewImages[color] = product.images[0];
        }
        return;
      }

      try {
        const response = await productApi.getProductByColor(productId.toString(), color);
        if (response.data?.images && response.data.images.length > 0) {
          previewImages[color] = response.data.images[0];
        }
      } catch (error) {
        console.error(`Error fetching preview for color ${color}:`, error);
      }
    });

    // Wait for all requests to settle
    try {
      await Promise.all(colorPromises);
    } catch (e) {
      // Individual errors already logged above; no-op here
    }

    setColorPreviewImages(previewImages);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US").format(price) + " VND";
  };

  // Handle color change with smooth transition (no loading states)
  const handleColorChange = async (color: string) => {
    if (color === selectedColor || !productId) return;
    
    // Update UI immediately for instant feedback
    setSelectedColor(color);
    setSelectedImageIndex(0); // Reset to first image

    // Try to preserve the currently selected size if possible
    const sizeToPreserve = selectedSizeLocal || undefined;

    // Create a new request token to ignore stale responses
    const requestId = ++variantRequestIdRef.current;
    // mark variant loading for UX (only for this request)
    setIsVariantLoading(true);

    try {
      const response = await productApi.getProductByColor(
        productId.toString(),
        color,
        sizeToPreserve
      );

      // Ignore if another request started afterwards
      if (requestId !== variantRequestIdRef.current) return;

      if (response.data) {
        setProduct(response.data);

        // Set the active color from API if available
        setSelectedColor(response.data.activeColor || color);

        // If we tried to preserve a size but it's not available for this color, clear it
        if (sizeToPreserve) {
          const stillAvailable = !!response.data.mapSizeToQuantity?.[sizeToPreserve];
          if (!stillAvailable) {
            setSelectedSizeLocal("");
            try { dispatch(setSelectedSizeAction("")); } catch (e) { /* noop */ }
            setSelectedAmount(1);
          } else {
            // Clamp amount to available stock for preserved size
            const available = response.data.mapSizeToQuantity?.[sizeToPreserve] ?? 0;
            setSelectedAmount((prev) => Math.max(1, Math.min(prev, available || 1)));
          }
        } else {
          // No preserved size: keep default behavior
          setSelectedAmount(1);
        }
      }
    } catch (error) {
      console.error("Error loading color variant:", error);
      // On error, revert to previous color if available
      if (product) {
        setSelectedColor(product.activeColor || product.colors[0] || "");
      }
    } finally {
      // Only clear loading if this is the latest request
      if (requestId === variantRequestIdRef.current) {
        setIsVariantLoading(false);
      }
    }
  };

  // Handle size selection
    const handleSizeSelect = async (size: string) => {
      // Update local UI state
      setSelectedSizeLocal(size);

      // Update shared Redux state (for consistency with ProductDetail flow)
      try {
        dispatch(setSelectedSizeAction(size));
      } catch (err) {
        console.warn('Failed to dispatch setSelectedSizeAction', err);
      }

      // Fetch variant directly so modal's local product (and detailId) reflect selected size
      if (!size || !productId) return;
      const colorToUse = selectedColor || product?.activeColor || product?.colors?.[0];
      if (!colorToUse) return; // guard for TypeScript and safety

      // Create request token and mark loading
      const requestId = ++variantRequestIdRef.current;
      setIsVariantLoading(true);

      try {
        const response = await productApi.getProductByColor(productId.toString(), colorToUse, size);

        // Ignore stale responses
        if (requestId !== variantRequestIdRef.current) return;

        if (response.data) {
          // Mark that this product update is from an internal variant fetch
          suppressProductChangeEffectsRef.current = true;
          setProduct(response.data);
          setSelectedColor(response.data.activeColor || colorToUse);

          // Clamp selected amount to available quantity for chosen size
          const available = response.data.mapSizeToQuantity?.[size] ?? 0;
          setSelectedAmount((prev) => Math.max(1, Math.min(prev, available || 1)));
        }
      } catch (error) {
        console.error('Error fetching product variant for size selection:', error);
        // Fallback: attempt to trigger global redux fetch flow if needed
        try {
          dispatch(fetchProductByColorRequest({ id: productId.toString(), color: colorToUse, size }));
        } catch (err) {
          // noop
        }
      } finally {
        // Only clear loading if this is the latest request
        if (requestId === variantRequestIdRef.current) {
          setIsVariantLoading(false);
        }
      }
    };

  const handleAddToCart = async () => {
    if (!selectedSizeLocal) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }

    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
        // Verify availability for selected size
        const availableQty = product.mapSizeToQuantity?.[selectedSizeLocal] ?? 0;
        if (selectedAmount > availableQty) {
          setShowSizeNotice(true);
          setTimeout(() => setShowSizeNotice(false), 3000);
          return;
        }

        setAddingToCart(true);
      
      await addToCartWithToast({
        productDetailId: product.detailId,
        quantity: selectedAmount,
        // Additional data for toast
        productImage: product.images[0] || '/images/placeholder.jpg',
        productTitle: product.title,
        price: product.price
      });

    } catch (error) {
      console.error("❌ Failed to add to cart:", error);
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSizeLocal) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }
    // TODO: Buy now logic
    console.log("Buy now:", {
      product: product?.detailId,
      color: selectedColor,
      size: selectedSizeLocal,
    });
    onClose();
  };

  // Image handling functions
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
    if (index === selectedImageIndex) {
      setImageError(false);
    }
  };

  const handleImageError = (index: number) => {
    if (index === selectedImageIndex) {
      setImageError(true);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    // Preload image immediately if not loaded, but don't show loading state
    if (!loadedImages.has(index)) {
      const targetImage = displayImages[index];
      if (targetImage) {
        preloadImage(targetImage, index);
      }
    }
  };

  // Preload image function
  const preloadImage = (src: string, index: number) => {
    if (!loadedImages.has(index) && src) {
      const img = new Image();
      img.onload = () => handleImageLoad(index);
      img.onerror = () => handleImageError(index);
      img.src = src;
    }
  };

  if (!isOpen) return null;

  function handleDecreaseAmount(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setSelectedAmount((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncreaseAmount(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    // Optionally, you can set a max based on available quantity
    setSelectedAmount((prev) => prev + 1);
  }

  function handleAmountChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const value = Math.max(1, Number(event.target.value));
    setSelectedAmount(value);
  }

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      onClick={onClose} // Click backdrop to close
    >
      <div 
        className="bg-white rounded-lg p-4 w-full max-w-4xl h-1/2 mx-4 relative shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-6 text-gray-400 text-xl z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {loading ? (
          // Simple loading state - no skeleton
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : product ? (
          <div className="flex gap-4 h-full">
            {/* Product Images */}
            <div className="w-1/3 flex flex-col h-full">
              <div className="flex-1 mb-1 min-h-0 relative">
                {/* Error fallback only */}
                {imageError && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded">
                    <div className="text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs">Unable to load image</p>
                    </div>
                  </div>
                )}

                <img
                  src={displayImages[selectedImageIndex] || displayImages[0]}
                  alt={product.title}
                  className="w-full h-full object-cover rounded transition-opacity duration-300"
                  onLoad={() => handleImageLoad(selectedImageIndex)}
                  onError={() => handleImageError(selectedImageIndex)}
                  style={{ display: imageError ? 'none' : 'block' }}
                />
              </div>
              {/* Image thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-1 overflow-x-auto flex-shrink-0 h-12">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      onMouseEnter={() => preloadImage(image, index)}
                      className={`flex-shrink-0 w-10 h-10 rounded border overflow-hidden relative transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-black border-2"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-200"
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-2/3 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-9 my-4">
                {/* Title */}
                <h2 className="text-lg font-bold text-black line-clamp-2">
                  {product.title}
                </h2>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-4 ml-2">
                      {product.colors.map((color) => (
                        <div 
                          key={color}
                          className={`cursor-pointer transition-all duration-300 ease-out ${
                            selectedColor === color ? 'active' : ''
                          }`}
                          onClick={() => handleColorChange(color)}
                        >
                          <div className={`w-24 h-24 rounded-xl border-2 overflow-hidden transition-all duration-300 ease-out shadow-sm hover:shadow-md ${
                            selectedColor === color
                              ? 'border-gray-800 transform scale-105'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            {colorPreviewImages[color] ? (
                              <img
                                src={colorPreviewImages[color]}
                                alt={`${product.title} in ${color}`}
                                className="w-full h-full object-cover transition-transform duration-300"
                                title={color}
                              />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              >
                                <span className="text-sm text-white bg-black bg-opacity-60 px-2 py-1 rounded-md font-medium">
                                  {color.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-center mt-2 text-gray-700 capitalize font-medium">
                            {color}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {Object.keys(product.mapSizeToQuantity).length > 0 && (
                  <div className="relative">
                    {/* Size Selection Notice */}
                    <div
                      className={`absolute z-10 transition-all duration-250 ease-in-out pointer-events-none ${
                        showSizeNotice
                          ? "opacity-100 visible -top-12 left-0"
                          : "opacity-0 invisible -top-12 left-0"
                      }`}
                      style={{
                        filter: "drop-shadow(0px 0px 10px rgba(46, 46, 46, 0.4))",
                        background: "#2E2E2E",
                        color: "white",
                        padding: "8px 12px",
                        letterSpacing: "1px",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      Please select a size
                      <div
                        className="absolute -bottom-1 left-3 w-0 h-0"
                        style={{
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: "4px solid #2E2E2E",
                        }}
                      />
                    </div>

                    <div className="flex space-x-2">
                      {Object.entries(product.mapSizeToQuantity).map(
                        ([size, quantity]) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            disabled={quantity === 0}
                            className={`w-12 h-8 text-xs font-medium border rounded-full transition-all duration-200 flex items-center justify-center ${
                              selectedSizeLocal === size
                                ? "border-black bg-black text-white"
                                : quantity === 0
                                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                                : "border-gray-300 text-gray-800 hover:border-gray-400"
                            }`}
                          >
                            {size}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Amount Selection */}
                <div>
                  <div className="flex h-12 w-full text-gray-900 border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={handleDecreaseAmount}
                      className="flex items-center justify-start ml-4 w-1/3 text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={selectedAmount}
                      onChange={handleAmountChange}
                      className="text-center w-1/3 text-sm focus:outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                    />
                    <button
                      onClick={handleIncreaseAmount}
                      className="flex items-center justify-end mr-4 w-1/3 text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {isEditMode ? (
                  <>
                    <button
                      onClick={() => {
                        // Validate selection
                        if (!selectedSizeLocal) {
                          setShowSizeNotice(true);
                          setTimeout(() => setShowSizeNotice(false), 3000);
                          return;
                        }

                        if (onConfirmEdit) {
                          onConfirmEdit({
                            cartItemId: cartItemId,
                            productDetailId: product?.detailId,
                            sizeName: selectedSizeLocal,
                            quantity: selectedAmount,
                          });
                        }
                      }}
                      type="button"
                      className="bg-white text-black py-4 px-3 font-bold text-xs uppercase border-1 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      Edit
                    </button>
                    <button
                      onClick={onClose}
                      type="button"
                      className="bg-black text-white py-4 px-3 font-bold text-xs uppercase"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !selectedSizeLocal || isVariantLoading}
                      type="button"
                      className="bg-white text-black py-4 px-3 font-bold text-xs uppercase border-1 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      {addingToCart ? "ADDING..." : "ADD TO CART"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      type="button"
                      className="bg-black text-white py-4 px-3 font-bold text-xs uppercase"
                    >
                      BUY NOW
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Error state
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Unable to load product information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
