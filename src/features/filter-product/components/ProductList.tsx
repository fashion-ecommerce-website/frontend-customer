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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              {/* Skeleton Image */}
              <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden rounded-xl bg-gray-200">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full" />
                <div className="absolute inset-0 w-full h-full bg-gray-300" />
              </div>
              {/* Skeleton Info */}
              <div className="space-y-2 sm:space-y-2.5 px-1">
                <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 sm:h-5 bg-gray-300 rounded w-1/2" />
                <div className="flex items-center gap-1.5 mt-2 sm:mt-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gray-300" />
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
                className="group cursor-pointer transition-all duration-300 ease-out"
                onClick={() =>
                  onProductClick(product.detailId, product.productSlug)
                }
              >
                {/* Product Image + Add to Cart Icon */}
                <div className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Add to Cart Icon */}
                  <button
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => handleOpenQuickView(product, e)}
                    aria-label="Quick view product"
                  >
                    <div className="scale-90 sm:scale-100 drop-shadow-lg">
                      <AddToCartSvg />
                    </div>
                  </button>
                  {firstImage ? (
                    <>
                      {/* base image */}
                      <div
                        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transform group-hover:scale-105 transition-transform duration-500 ease-out"
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
                <div className="space-y-1.5 sm:space-y-2 px-1">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-black transition-colors">
                    {product.productTitle}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-black">
                    {formatPrice(product.price)}
                  </p>
                  {/* Available colors */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {product.colors.slice(0, 5).map((color, index) => {
                      let colorClass = "";
                      switch (color) {
                        case "black":
                          colorClass = "bg-black";
                          break;
                        case "white":
                          colorClass = "bg-white border-2 border-gray-300";
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
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${colorClass} ring-1 ring-gray-200 transition-transform hover:scale-110`}
                          title={color}
                        />
                      );
                    })}
                    {product.colors.length > 5 && (
                      <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 5}</span>
                    )}
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
