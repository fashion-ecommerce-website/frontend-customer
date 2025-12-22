"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { FilterProductItem } from "../types";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { ProductCard, ProductCardSkeleton } from "@/components";
import { Product } from "@/types/product.types";
import { useLanguage } from "@/hooks/useLanguage";

interface ProductListProps {
  products: FilterProductItem[];
  isLoading: boolean;
  onProductClick?: (detailId: number, slug: string) => void;
  gridColumns?: string; // Custom grid columns classes
}

// Adapter function to convert FilterProductItem to Product
const convertToProduct = (item: FilterProductItem): Product => ({
  id: item.detailId.toString(),
  name: item.productTitle,
  brand: "", // Not available in FilterProductItem
  price: item.price,
  finalPrice: item.finalPrice,
  percentOff: item.percentOff,
  promotionId: item.promotionId,
  promotionName: item.promotionName,
  image: item.imageUrls[0] || "",
  images: item.imageUrls,
  category: "", // Not available in FilterProductItem
  colors: item.colors,
  sizes: [], // Not available in FilterProductItem
  originalPrice: Math.round(item.price * 1.3),
});

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onProductClick,
}) => {
  const router = useRouter();
  const { translations } = useLanguage();
  // State for quick view modal
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<number | null>(null);

  const handleOpenQuickView = (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setQuickViewProductId(parseInt(product.id));
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewProductId(null);
  };

  // Số lượng skeleton card muốn hiển thị khi loading
  const skeletonCount = 8;

  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black text-lg">{translations.filterProduct.noProductsFound}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
      {isLoading && products.length === 0
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))
        : products.map((item) => {
            const product = convertToProduct(item);
            return (
              <ProductCard
                key={item.detailId}
                product={product}
                onProductClick={() => {
                  if (onProductClick) {
                    onProductClick(item.detailId, item.productSlug);
                  } else {
                    router.push(`/products/${item.detailId}`);
                  }
                }}
                onQuickView={(product, e) => handleOpenQuickView(product, e)}
              />
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
