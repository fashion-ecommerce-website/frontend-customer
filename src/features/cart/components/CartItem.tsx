"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CartItemComponentProps } from "../types";

export const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onRemove,
  onSelect,
  onUnselect,
  onEdit,
  loading = false,
  onProductClick,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleRemove = async () => {
    if (isRemoving || loading) return;

    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      // Reset after a delay to prevent rapid clicking
      setTimeout(() => setIsRemoving(false), 1000);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(item.productDetailId);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelect(item.id);
    } else {
      onUnselect(item.id);
    }
  };

  return (
    <div className="flex items-start space-x-4 py-6 border-b border-gray-200 last:border-b-0">
      {/* Product Image with Checkbox Overlay */}
      <div className="flex-shrink-0 relative">
        <button
          type="button"
          onClick={handleProductClick}
          className="p-0 m-0 block focus:outline-none"
          aria-label={`Open product ${item.productTitle}`}
        >
          <Image
            src={item.imageUrl}
            alt={item.productTitle}
            width={120}
            height={148}
            className="object-cover rounded-lg"
          />
        </button>
        {/* Checkbox positioned at top-left corner */}
        <div className="absolute top-0 left-0">
          <input
            type="checkbox"
            checked={item.selected !== false} // Default to true if not specified
            onChange={handleSelectChange}
            className="border-gray-300 w-5 h-5 text-gray-800 focus:ring-gray-800 accent-gray-800 transition-all duration-200 bg-white rounded shadow-sm"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 font-medium">
        <h3
          className="text-[14px] text-black hover:text-[#BB9244] mb-1 cursor-pointer"
          onClick={handleProductClick}
          role="button"
          tabIndex={0}
        >
          {item.productTitle}
        </h3>

        <p className="text-[12px] text-black mb-1">
          {item.colorName} / {item.sizeName}
        </p>

        <p className="text-[14px] text-black mb-2">
          Quantity: {item.quantity}
        </p>

        {/* Price */}
        <div className="flex flex-col">
          {item.finalPrice && item.finalPrice < item.price ? (
            <>
              <div className="text-[14px] line-through text-gray-500">
                {formatPrice(item.price)}
              </div>
              <div className="text-[16px] font-bold text-red-600">
                {formatPrice(item.finalPrice)}
              </div>
            </>
          ) : (
            <div className="text-[16px] font-bold text-black">
              {formatPrice(item.price)}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={handleEdit}
          disabled={loading}
          className="w-[80px] font-semibold py-1 text-sm border border-gray-300 rounded text-black hover:text-yellow-700 transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={handleRemove}
          disabled={loading || isRemoving}
          className="w-[80px] font-semibold py-1 text-sm border border-gray-300 rounded text-black hover:text-yellow-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
};
