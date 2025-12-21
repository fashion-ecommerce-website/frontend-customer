"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useCartActions } from "@/hooks/useCartActions"
import { selectIsAuthenticated } from "@/features/auth/login/redux/loginSlice"
import { productApi, type ProductDetail } from "@/services/api/productApi"
import {
  fetchProductByColorRequest,
  setSelectedSize as setSelectedSizeAction,
} from "@/features/product-detail/redux/productDetailSlice"
import { recommendationApi, ActionType } from "@/services/api/recommendationApi"
import { useToast } from "@/providers/ToastProvider"
import { useRouter } from "next/navigation"
import { OrderModal } from "@/components/modals"
import { useColorMap } from "@/hooks/useColorMap"

interface ProductQuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number | null
  currentSize?: string // Size hiện tại trong cart (optional)
  // Edit mode props
  isEditMode?: boolean
  // The cart item id being edited (so caller can identify which cart item to update)
  cartItemId?: number
  // Current quantity for the cart item when opening in edit mode
  currentQuantity?: number
  // Callback invoked when user confirms edit. Receives { cartItemId, productDetailId, sizeName, quantity }
  onConfirmEdit?: (payload: {
    cartItemId?: number
    productDetailId?: number
    sizeName?: string
    quantity?: number
  }) => void
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
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const { showError } = useToast()
  const router = useRouter()
  const { getColorHex } = useColorMap()
  const { addToCartWithToast } = useCartActions({
    onSuccess: () => {
      setAddingToCart(false)
      onClose() // Close modal after successful add
    },
    onError: () => {
      setAddingToCart(false)
    },
  })

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>("")
  // Local selected size state (renamed to avoid colliding with Redux action name)
  const [selectedSizeLocal, setSelectedSizeLocal] = useState<string>("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showSizeNotice, setShowSizeNotice] = useState(false)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)
  const [isVariantLoading, setIsVariantLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [colorPreviewImages, setColorPreviewImages] = useState<{
    [color: string]: string
  }>({})
  // Request token to ignore stale variant/color responses
  const variantRequestIdRef = useRef(0)
  // When true, the next product change should not trigger preview refetch or reset UI
  const suppressProductChangeEffectsRef = useRef(false)

  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Image handling functions - defined early for use in useEffects
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index))
    setImageError(false)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageError = useCallback((index: number) => {
    setImageError(true)
  }, [])

  // Handle escape key to close modal - MOVED UP
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      // Calculate scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open and compensate for scrollbar
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 50) // Small delay makes entrance feel more natural
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Fetch product detail when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return

      setLoading(true)
      try {
        const response = await productApi.getProductById(productId.toString())
        if (response.data) {
          setProduct(response.data)
        }
      } catch (error) {
        console.error("Error fetching product detail:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen && productId) {
      fetchProduct()
      // Reset quantity when modal opens
      // Default amount to 1 unless editing an existing cart item with a provided quantity
      if (!(isEditMode && typeof currentQuantity === "number")) {
        setSelectedAmount(1)
      } else {
        setSelectedAmount(Math.max(1, currentQuantity))
      }
    }
  }, [isOpen, productId, isEditMode, currentQuantity])

  // If modal opened for edit, preselect size from prop when product loads
  useEffect(() => {
    if (isOpen && isEditMode && currentSize) {
      setSelectedSizeLocal(currentSize)
    }
  }, [isOpen, isEditMode, currentSize])

  // Prefill amount when opening in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && typeof currentQuantity === "number") {
      setSelectedAmount(Math.max(1, currentQuantity))
    }
  }, [isOpen, isEditMode, currentQuantity])

  // Reset state when product changes
  useEffect(() => {
    const fetchPreviewImages = async () => {
      if (!productId || !product?.colors) return

      const previewImages: { [color: string]: string } = {}

      const colorPromises = product.colors.map(async (color) => {
        if (color === product.activeColor) {
          if (product.images && product.images.length > 0) {
            previewImages[color] = product.images[0]
          }
          return
        }

        try {
          const response = await productApi.getProductByColor(productId.toString(), color)
          if (response.data?.images && response.data.images.length > 0) {
            previewImages[color] = response.data.images[0]
          }
        } catch (error) {
          console.error(`Error fetching preview for color ${color}:`, error)
        }
      })

      try {
        await Promise.all(colorPromises)
      } catch {
        // Individual errors already logged above
      }

      setColorPreviewImages(previewImages)
    }

    if (product) {
      setSelectedColor(product.activeColor || product.colors[0] || "")

      // If this product change was caused by an internal variant fetch (size selection),
      // skip resetting the UI and avoid re-fetching preview images which would cause
      // additional API calls. Otherwise, perform the normal reset logic.
      if (suppressProductChangeEffectsRef.current) {
        // Clear the suppress flag for subsequent product changes
        suppressProductChangeEffectsRef.current = false
      } else {
        // Set size từ cart nếu có, nếu không thì để trống
        setSelectedSizeLocal(currentSize || "")
        setSelectedImageIndex(0)
        setShowSizeNotice(false)
        // Reset quantity to 1 when product changes, except preserve edit-mode initial quantity
        if (!(isEditMode && typeof currentQuantity === "number")) {
          setSelectedAmount(1)
        } else {
          setSelectedAmount(Math.max(1, currentQuantity))
        }
        // Don't reset image loading states - let images load naturally

        // Fetch color preview images
        fetchPreviewImages()
      }
    }
  }, [product, currentSize, productId, isEditMode, currentQuantity])

  // Simplified preload effect - preload first two images when product loads
  useEffect(() => {
    const doPreload = (src: string, index: number) => {
      if (!loadedImages.has(index) && src) {
        const img = new window.Image()
        img.onload = () => handleImageLoad(index)
        img.onerror = () => handleImageError(index)
        img.src = src
      }
    }

    if (product?.images && product.images.length > 0) {
      const firstImage = product.images[0]
      if (firstImage) {
        doPreload(firstImage, 0)
      }

      if (product.images.length > 1) {
        const secondImage = product.images[1]
        setTimeout(() => doPreload(secondImage, 1), 100)
      }
    }
  }, [product?.images, loadedImages, handleImageLoad, handleImageError])

  // Preload adjacent images when user changes selection
  useEffect(() => {
    const doPreload = (src: string, index: number) => {
      if (!loadedImages.has(index) && src) {
        const img = new window.Image()
        img.onload = () => handleImageLoad(index)
        img.onerror = () => handleImageError(index)
        img.src = src
      }
    }

    if (product?.images && product.images.length > 1) {
      const nextIndex = selectedImageIndex + 1
      const prevIndex = selectedImageIndex - 1

      if (nextIndex < product.images.length) {
        setTimeout(() => doPreload(product.images[nextIndex], nextIndex), 50)
      }

      if (prevIndex >= 0) {
        setTimeout(() => doPreload(product.images[prevIndex], prevIndex), 50)
      }
    }
  }, [selectedImageIndex, product?.images, loadedImages, handleImageLoad, handleImageError])





  // Handle color change with smooth transition (no loading states)
  const handleColorChange = async (color: string) => {
    if (color === selectedColor || !productId) return

    // Update UI immediately for instant feedback
    setSelectedColor(color)
    setSelectedImageIndex(0) // Reset to first image

    // Try to preserve the currently selected size if possible
    const sizeToPreserve = selectedSizeLocal || undefined

    // Create a new request token to ignore stale responses
    const requestId = ++variantRequestIdRef.current
    // mark variant loading for UX (only for this request)
    setIsVariantLoading(true)

    try {
      const response = await productApi.getProductByColor(productId.toString(), color, sizeToPreserve)

      // Ignore if another request started afterwards
      if (requestId !== variantRequestIdRef.current) return

      if (response.data) {
        setProduct(response.data)

        // Set the active color from API if available
        setSelectedColor(response.data.activeColor || color)

        // If we tried to preserve a size but it's not available for this color, clear it
        if (sizeToPreserve) {
          const stillAvailable = !!response.data.mapSizeToQuantity?.[sizeToPreserve]
          if (!stillAvailable) {
            setSelectedSizeLocal("")
            try {
              dispatch(setSelectedSizeAction(""))
            } catch {
              /* noop */
            }
            setSelectedAmount(1)
          } else {
            // Clamp amount to available stock for preserved size
            const available = response.data.mapSizeToQuantity?.[sizeToPreserve] ?? 0
            setSelectedAmount((prev) => Math.max(1, Math.min(prev, available || 1)))
          }
        } else {
          // No preserved size: keep default behavior
          setSelectedAmount(1)
        }
      }
    } catch (error) {
      console.error("Error loading color variant:", error)
      // On error, revert to previous color if available
      if (product) {
        setSelectedColor(product.activeColor || product.colors[0] || "")
      }
    } finally {
      // Only clear loading if this is the latest request
      if (requestId === variantRequestIdRef.current) {
        setIsVariantLoading(false)
      }
    }
  }

  // Handle size selection
  const handleSizeSelect = async (size: string) => {
    // Update local UI state
    setSelectedSizeLocal(size)

    // Update shared Redux state (for consistency with ProductDetail flow)
    try {
      dispatch(setSelectedSizeAction(size))
    } catch {
      console.warn("Failed to dispatch setSelectedSizeAction")
    }

    // Fetch variant directly so modal's local product (and detailId) reflect selected size
    if (!size || !productId) return
    const colorToUse = selectedColor || product?.activeColor || product?.colors?.[0]
    if (!colorToUse) return // guard for TypeScript and safety

    // Create request token and mark loading
    const requestId = ++variantRequestIdRef.current
    setIsVariantLoading(true)

    try {
      const response = await productApi.getProductByColor(productId.toString(), colorToUse, size)

      // Ignore stale responses
      if (requestId !== variantRequestIdRef.current) return

      if (response.data) {
        // Mark that this product update is from an internal variant fetch
        suppressProductChangeEffectsRef.current = true
        setProduct(response.data)
        setSelectedColor(response.data.activeColor || colorToUse)

        // Clamp selected amount to available quantity for chosen size
        const available = response.data.mapSizeToQuantity?.[size] ?? 0
        setSelectedAmount((prev) => Math.max(1, Math.min(prev, available || 1)))
      }
    } catch (error) {
      console.error("Error fetching product variant for size selection:", error)
      // Fallback: attempt to trigger global redux fetch flow if needed
      try {
        dispatch(
          fetchProductByColorRequest({
            id: productId.toString(),
            color: colorToUse,
            size,
          }),
        )
      } catch {
        // noop
      }
    } finally {
      // Only clear loading if this is the latest request
      if (requestId === variantRequestIdRef.current) {
        setIsVariantLoading(false)
      }
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSizeLocal) {
      setShowSizeNotice(true)
      showError('Please select a size')
      setTimeout(() => setShowSizeNotice(false), 3000)
      return
    }

    if (!product) {
      return
    }

    // Verify availability for selected size
    const availableQty = product.mapSizeToQuantity?.[selectedSizeLocal] ?? 0
    if (availableQty === 0) {
      showError('This size is out of stock')
      return
    }

    if (selectedAmount > availableQty) {
      setShowSizeNotice(true)
      showError(`Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for this size`)
      setTimeout(() => setShowSizeNotice(false), 3000)
      return
    }

    if (!isAuthenticated) {
      // Save cart intent to sessionStorage before redirecting to login
      sessionStorage.setItem('pendingCartAction', JSON.stringify({
        productDetailId: product.detailId,
        sizeName: selectedSizeLocal,
        quantity: selectedAmount,
        returnUrl: window.location.pathname
      }))
      router.push(`/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    try {

      setAddingToCart(true)

      await addToCartWithToast({
        productDetailId: product.detailId,
        quantity: selectedAmount,
        // Additional data for toast
        productImage: product.images[0] || "/images/placeholder.jpg",
        productTitle: product.title,
        price: product.price,
        finalPrice: product.finalPrice,
      })

      // Record ADD_TO_CART interaction
      try {
        // Note: ProductQuickViewModal uses 'product' which is ProductDetail
        // We need to ensure we use productId, not detailId
        if (product.productId) {
          await recommendationApi.recordInteraction(product.productId, ActionType.ADD_TO_CART, selectedAmount)
          console.log("✅ Recorded ADD_TO_CART interaction from QuickView")
        }
      } catch (error) {
        console.error("❌ Failed to record ADD_TO_CART interaction:", error)
        // Fail silently
      }
    } catch (error) {
      console.error("❌ Failed to add to cart:", error)
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!selectedSizeLocal) {
      setShowSizeNotice(true)
      showError('Please select a size')
      setTimeout(() => setShowSizeNotice(false), 3000)
      return
    }

    if (!product) return

    // Validate stock availability
    const availableQty = product.mapSizeToQuantity?.[selectedSizeLocal] ?? 0
    if (availableQty === 0) {
      showError('This size is out of stock')
      return
    }

    if (selectedAmount > availableQty) {
      showError(`Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for this size`)
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingCartAction', JSON.stringify({
        productDetailId: product.detailId,
        sizeName: selectedSizeLocal,
        quantity: selectedAmount,
        returnUrl: `/products/${product.detailId}`,
        isBuyNow: true
      }))
      router.push(`/auth/login?returnUrl=/products/${product.detailId}`)
      return
    }

    // Record interaction for recommendation system
    try {
      await recommendationApi.recordInteraction(product.productId, ActionType.ADD_TO_CART, selectedAmount)
      console.log('Recorded ADD_TO_CART interaction for Buy Now')
    } catch (error) {
      console.error('Failed to record ADD_TO_CART interaction:', error)
    }

    // Open Buy Now modal directly instead of navigating
    setShowBuyNowModal(true)
  }

  // Create ProductItem for Buy Now modal
  const buyNowProduct = product ? {
    detailId: product.detailId,
    productTitle: product.title,
    productSlug: product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    price: product.price,
    finalPrice: product.finalPrice ?? product.price,
    percentOff: product.percentOff,
    quantity: selectedAmount,
    colors: product.colors || [],
    colorName: product.activeColor || selectedColor,
    sizeName: selectedSizeLocal || product.activeSize || '',
    imageUrls: product.images || []
  } : null

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
    // Preload image immediately if not loaded, but don't show loading state
    if (!loadedImages.has(index)) {
      const targetImage = displayImages[index]
      if (targetImage) {
        preloadImage(targetImage, index)
      }
    }
  }

  // Preload image function
  const preloadImage = (src: string, index: number) => {
    if (!loadedImages.has(index) && src) {
      const img = new window.Image()
      img.onload = () => handleImageLoad(index)
      img.onerror = () => handleImageError(index)
      img.src = src
    }
  }

  if (!shouldRender) return null

  function handleDecreaseAmount(): void {
    setSelectedAmount((prev) => (prev > 1 ? prev - 1 : 1))
  }

  function handleIncreaseAmount(): void {
    // Optionally, you can set a max based on available quantity
    setSelectedAmount((prev) => prev + 1)
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = Math.max(1, Number(event.target.value))
    setSelectedAmount(value)
  }

  const displayImages =
    product?.images && product.images.length > 0 ? product.images : ["/images/placeholder-product.jpg"]

  return (
    <>
      {/* Quick View Modal - hidden when Buy Now modal is open */}
      <div
        className={`fixed inset-0 bg-black/75 flex items-end md:items-center justify-center z-50 transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"} ${showBuyNowModal ? "hidden" : ""}`}
        onClick={onClose} // Click backdrop to close
      >
      <div
        className={`bg-white rounded-t-2xl md:rounded-lg p-4 w-full max-w-4xl mx-4 relative shadow-2xl border border-gray-200 overflow-hidden h-[70vh] transition-all duration-300 ${isAnimating
          ? "translate-y-0 md:scale-100 opacity-100"
          : "translate-y-full md:translate-y-0 md:scale-0 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile handle */}
        <div className="md:hidden flex items-center justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full my-2" />
        </div>
        {/* Close button */}
        <button
          className="absolute top-3 right-6 text-gray-400 text-xl z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {loading ? (
          // Simple loading state - no skeleton
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Product Images (hidden on mobile - mobile shows condensed UI) */}
            <div className="hidden md:flex md:w-2/3 flex-col h-full">
              <div className="flex-1 mb-1 min-h-0 relative">
                {/* Error fallback only */}
                {imageError && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded">
                    <div className="text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs">Unable to load image</p>
                    </div>
                  </div>
                )}

                <Image
                  src={displayImages[selectedImageIndex] || displayImages[0]}
                  alt={product.title}
                  fill
                  className={`object-cover rounded transition-opacity duration-300 ${imageError ? "hidden" : "block"}`}
                  onLoad={() => handleImageLoad(selectedImageIndex)}
                  onError={() => handleImageError(selectedImageIndex)}
                />
              </div>
              {/* Image thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-1 overflow-x-auto flex-shrink-0 h-12 md:flex-wrap md:gap-2">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      onMouseEnter={() => preloadImage(image, index)}
                      className={`flex-shrink-0 w-8 h-10 rounded-sm border overflow-hidden relative transition-all duration-200 ${selectedImageIndex === index ? "border-black border-1" : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover transition-opacity duration-200"
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-full md:w-2/3 flex flex-col justify-between overflow-y-auto">
              {/* Mobile condensed view: title, color, size, buttons */}
              <div className="block md:hidden space-y-4">
                <h2 className="text-lg font-bold text-black line-clamp-2 py-4">{product.title}</h2>

                {/* Colors (mobile compact) */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-3 pl-1 py-2 overflow-x-auto">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-12 h-12 rounded-sm border overflow-hidden flex items-center justify-center relative ${selectedColor === color ? "ring-2 ring-black" : "border-gray-200"
                            }`}
                          title={color}
                        >
                          {colorPreviewImages[color] ? (
                            <Image
                              src={colorPreviewImages[color] || "/placeholder.svg"}
                              alt={color}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full" style={{ backgroundColor: getColorHex(color) }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes (mobile compact) */}
                {Object.keys(product.mapSizeToQuantity).length > 0 && (
                  <div>
                    <div className="flex space-x-2 overflow-x-auto">
                      {Object.entries(product.mapSizeToQuantity).map(([size, quantity]) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={quantity === 0}
                          className={`px-3 py-2 text-sm font-medium w-12 h-10 rounded-full border transition-all ${selectedSizeLocal === size
                            ? "bg-black text-white border-black"
                            : quantity === 0
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-800 border-gray-300"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div>
                  <div className="flex h-12 w-full text-gray-900 border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={handleDecreaseAmount}
                      className="flex items-center justify-start ml-4 w-1/3 text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={selectedAmount}
                      onChange={handleAmountChange}
                      className="text-center w-1/3 text-sm focus:outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                    />
                    <button onClick={handleIncreaseAmount} className="flex items-center justify-end mr-4 w-1/3 text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 5V19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile action buttons */}
                <div className="flex gap-2">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={onClose}
                        type="button"
                        className="flex-1 bg-white text-black py-3 font-bold text-sm uppercase border border-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!selectedSizeLocal) {
                            setShowSizeNotice(true)
                            showError('Please select a size')
                            setTimeout(() => setShowSizeNotice(false), 3000)
                            return
                          }

                          // Validate stock availability
                          if (product) {
                            const availableQty = product.mapSizeToQuantity?.[selectedSizeLocal] ?? 0
                            if (selectedAmount > availableQty) {
                              setShowSizeNotice(true)
                              showError(`Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for this size`)
                              setTimeout(() => setShowSizeNotice(false), 3000)
                              return
                            }
                          }

                          if (onConfirmEdit) {
                            onConfirmEdit({
                              cartItemId: cartItemId,
                              productDetailId: product?.detailId,
                              sizeName: selectedSizeLocal,
                              quantity: selectedAmount,
                            })
                          }
                        }}
                        type="button"
                        className="flex-1 bg-black text-white py-3 font-bold text-sm uppercase"
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart || !selectedSizeLocal || isVariantLoading}
                        type="button"
                        className="flex-1 bg-white text-black py-3 font-bold text-sm uppercase border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart ? "ADDING..." : "ADD TO CART"}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        type="button"
                        className="flex-1 bg-black text-white py-3 font-bold text-sm uppercase"
                      >
                        BUY NOW
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop / tablet full detail (hidden on mobile) */}
              <div className="hidden md:block space-y-9 my-4">
                {/* ...existing full content... */}
                {/* Title */}
                <h2 className="text-lg font-bold text-black line-clamp-2">{product.title}</h2>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-4 ml-2 pt-2 overflow-x-auto">
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className={`cursor-pointer transition-all duration-300 ease-out ${selectedColor === color ? "active" : ""
                            }`}
                          onClick={() => handleColorChange(color)}
                        >
                          <div
                            className={`w-20 h-24 rounded-[5px] border-1 overflow-hidden transition-all duration-300 ease-out shadow-sm hover:shadow-md relative ${selectedColor === color
                              ? "border-gray-800"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            {colorPreviewImages[color] ? (
                              <Image
                                src={colorPreviewImages[color] || "/placeholder.svg"}
                                alt={`${product.title} in ${color}`}
                                fill
                                className="object-cover transition-transform duration-300"
                                title={color}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: getColorHex(color) }}
                                title={color}
                              >
                                <span className="text-sm text-white bg-black bg-opacity-60 px-2 py-1 rounded-md font-medium">
                                  {color.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-center mt-2 text-gray-700 capitalize font-medium">{color}</p>
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
                      className={`absolute z-10 transition-all duration-250 ease-in-out pointer-events-none ${showSizeNotice ? "opacity-100 visible -top-12 left-0" : "opacity-0 invisible -top-12 left-0"
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

                    <div className="flex space-x-2 overflow-x-auto">
                      {Object.entries(product.mapSizeToQuantity).map(([size, quantity]) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={quantity === 0}
                          className={`w-12 h-8 text-xs font-medium border rounded-full transition-all duration-200 flex items-center justify-center ${selectedSizeLocal === size
                            ? "border-black bg-black text-white"
                            : quantity === 0
                              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                              : "border-gray-300 text-gray-800 hover:border-gray-400"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
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
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={selectedAmount}
                      onChange={handleAmountChange}
                      className="text-center w-1/3 text-sm focus:outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                    />
                    <button onClick={handleIncreaseAmount} className="flex items-center justify-end mr-4 w-1/3 text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 5V19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons (hidden on mobile; mobile uses its own buttons above) */}
              <div className="hidden md:grid grid-cols-2 gap-2 mt-3 md:grid-cols-2">
                {isEditMode ? (
                  <>
                    <button
                      onClick={onClose}
                      type="button"
                      className="bg-white text-black py-4 px-3 font-bold text-xs uppercase border-1 border-gray-300 w-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Validate selection
                        if (!selectedSizeLocal) {
                          setShowSizeNotice(true)
                          showError('Please select a size')
                          setTimeout(() => setShowSizeNotice(false), 3000)
                          return
                        }

                        // Validate stock availability
                        if (product) {
                          const availableQty = product.mapSizeToQuantity?.[selectedSizeLocal] ?? 0
                          if (selectedAmount > availableQty) {
                            setShowSizeNotice(true)
                            showError(`Only ${availableQty} item${availableQty > 1 ? 's' : ''} available for this size`)
                            setTimeout(() => setShowSizeNotice(false), 3000)
                            return
                          }
                        }

                        if (onConfirmEdit) {
                          onConfirmEdit({
                            cartItemId: cartItemId,
                            productDetailId: product?.detailId,
                            sizeName: selectedSizeLocal,
                            quantity: selectedAmount,
                          })
                        }
                      }}
                      type="button"
                      className="bg-black text-white py-4 px-3 font-bold text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-opacity w-full"
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !selectedSizeLocal || isVariantLoading}
                      type="button"
                      className="bg-white text-black py-4 px-3 font-bold text-xs uppercase border-1 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity w-full"
                    >
                      {addingToCart ? "ADDING..." : "ADD TO CART"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      type="button"
                      className="bg-black text-white py-4 px-3 font-bold text-xs uppercase w-full"
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

      {/* Buy Now Order Modal */}
      {buyNowProduct && (
        <OrderModal
          isOpen={showBuyNowModal}
          onClose={() => {
            setShowBuyNowModal(false)
            onClose() // Also close the quick view modal
          }}
          products={[buyNowProduct]}
          isBuyNow={true}
        />
      )}
    </>
  )
}

export default ProductQuickViewModal
