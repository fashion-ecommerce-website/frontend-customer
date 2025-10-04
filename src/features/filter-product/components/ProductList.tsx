"use client";
import React, { useState } from "react";

import AddToCartSvg from "../../../components/AddToCartSvg";
import { FilterProductItem } from "../types";
import { ProductQuickViewModal } from "./ProductQuickViewModal";

interface ProductListProps {
  products: FilterProductItem[];
  isLoading: boolean;
  onProductClick: (detailId: number, slug: string) => void;
  gridColumns?: string; // Custom grid columns classes
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onProductClick,
}) => {
  // State for quick view modal
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<number | null>(null);

  const handleOpenQuickView = (
    product: FilterProductItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setQuickViewProductId(product.detailId);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProductId(null);
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Số lượng skeleton card muốn hiển thị khi loading
  const skeletonCount = 8;

  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              {/* Skeleton Image */}
              <div className="relative w-full aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-200">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full" />
                <div className="absolute inset-0 w-full h-full bg-gray-300" />
              </div>
              {/* Skeleton Info */}
              <div className="space-y-1 sm:space-y-2">
                <div className="h-4 sm:h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/3" />
                <div className="flex items-center gap-1 mt-1 sm:mt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300" />
                  ))}
                </div>
              </div>
            </div>
          ))
        : products.map((product) => {
            const firstImage = product.imageUrls?.[0] ?? "";
            const secondImage = product.imageUrls?.[1] ?? null;

            return (
              <div
                key={product.detailId}
                className="group cursor-pointer"
                onClick={() =>
                  onProductClick(product.detailId, product.productSlug)
                }
              >
                {/* Product Image + Add to Cart Icon */}
                <div className="relative w-full aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100">
                  {/* Add to Cart Icon */}
                  <button
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10"
                    onClick={(e) => handleOpenQuickView(product, e)}
                    aria-label="Quick view product"
                  >
                    <div className="scale-75 sm:scale-100">
                      <AddToCartSvg />
                    </div>
                  </button>
                  {firstImage ? (
                    <>
                      {/* base image */}
                      <div
                        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${firstImage})` }}
                      />

                      {/* hover: show next image with fade only */}
                      {secondImage && (
                        <div
                          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100"
                          style={{ backgroundImage: `url(${secondImage})` }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-black text-sm sm:text-[16px] line-clamp-2 leading-tight">
                    {product.productTitle}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-black">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  {/* Available colors */}
                  <div className="flex items-center gap-1">
                    {product.colors.map((color, index) => {
                      let colorClass = "";
                      switch (color) {
                        case "black":
                          colorClass = "bg-black";
                          break;
                        case "white":
                          colorClass = "bg-white border border-gray-500";
                          break;
                        case "red":
                          colorClass = "bg-[#FF0000]";
                          break;
                        case "gray":
                          colorClass = "bg-[#CCCACA]";
                          break;
                        case "blue":
                          colorClass = "bg-[#5100FF]";
                          break;
                        case "pink":
                          colorClass = "bg-[#DB999B]";
                          break;
                        case "yellow":
                          colorClass = "bg-[#FFFF05]";
                          break;
                        case "purple":
                          colorClass = "bg-[#B5129A]";
                          break;
                        case "brown":
                          colorClass = "bg-[#753A3A]";
                          break;
                        case "green":
                          colorClass = "bg-[#3CFA08]";
                          break;
                        case "beige":
                          colorClass = "bg-[#DCB49E]";
                          break;
                        case "orange":
                          colorClass = "bg-[#F5B505]";
                          break;
                        default:
                          colorClass = "bg-gray-400";
                      }
                      return (
                        <div
                          key={index}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${colorClass}`}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      
      {/* Quick View Modal */}
      <ProductQuickViewModal
        isOpen={quickViewOpen}
        onClose={handleCloseQuickView}
        productId={quickViewProductId}
      />
    </div>
  );
};
