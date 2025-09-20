"use client";

import React, { useState, useEffect } from "react";
import { productApi, ProductDetail } from "@/services/api/productApi";

interface ProductQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeNotice, setShowSizeNotice] = useState(false);

  // Fetch product detail when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetail();
    }
  }, [isOpen, productId]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.activeColor || product.colors[0] || "");
      setSelectedSize("");
      setSelectedImageIndex(0);
      setShowSizeNotice(false);
    }
  }, [product]);

  const fetchProductDetail = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await productApi.getProductById(productId.toString());
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Reset size selection when color changes
    setSelectedSize("");
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeNotice(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }
    // TODO: Add to cart logic
    console.log("Adding to cart:", {
      product: product?.detailId,
      color: selectedColor,
      size: selectedSize,
    });
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowSizeNotice(true);
      setTimeout(() => setShowSizeNotice(false), 3000);
      return;
    }
    // TODO: Buy now logic
    console.log("Buy now:", {
      product: product?.detailId,
      color: selectedColor,
      size: selectedSize,
    });
    onClose();
  };

  if (!isOpen) return null;

  const [selectedAmount, setSelectedAmount] = useState<number>(1);

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
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-1/2 mx-4 relative shadow-2xl border border-gray-200 overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {loading ? (
          // Loading state
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : product ? (
          <div className="flex gap-4 h-full">
            {/* Product Images */}
            <div className="w-1/3 flex flex-col h-full">
              <div className="flex-1 mb-1 min-h-0">
                <img
                  src={product.images[selectedImageIndex] || ""}
                  alt={product.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              {/* Image thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-1 overflow-x-auto flex-shrink-0 h-12">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-10 h-10 rounded border overflow-hidden ${
                        selectedImageIndex === index
                          ? "border-black border-2"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="w-2/3 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3">
                {/* Title */}
                <h2 className="text-lg font-bold text-black line-clamp-2">
                  {product.title}
                </h2>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 mb-1">Colors</h3>
                    <div className="flex items-center space-x-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => handleColorSelect(color)}
                          title={color}
                        />
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
                            className={`w-10 h-8 text-xs font-medium border rounded transition-all duration-200 ${
                              selectedSize === size
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
                      className="flex items-center ml-4 w-1/3 text-sm"
                    >
                      -
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
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="bg-white text-black py-4 px-3 font-bold text-xs uppercase border-1 border-gray-300"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  type="button"
                  className="bg-black text-white py-4 px-3 font-bold text-xs uppercase"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Error state
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Không thể tải thông tin sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
