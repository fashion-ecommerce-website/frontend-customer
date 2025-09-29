"use client";

import React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductList } from "@/features/filter-product/components";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectWishlistItems, selectWishlistLoading, selectWishlistError, fetchWishlistRequest, toggleWishlistRequest } from "@/features/profile/redux/wishlistSlice";
import { useToast } from "@/providers/ToastProvider";

export const Wishlist: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(selectWishlistError);
  useEffect(() => { dispatch(fetchWishlistRequest()); }, [dispatch]);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const { showSuccess } = useToast();

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const handleEditClick = () => {
    setEditMode((prev) => {
      if (prev) setSelected([]);
      return !prev;
    });
  };

  const handleClearClick = () => {
    const hasSelection = editMode && selected.length > 0;
    const count = hasSelection ? selected.length : items.length;
    const message = hasSelection
      ? `Are you sure you want to delete ${count} selected items?`
      : 'Are you sure you want to clear all wishlist items?';
    setConfirmConfig({
      message,
      onConfirm: async () => {
        if (hasSelection) {
          // Remove only selected items
          selected.forEach((detailId) => dispatch(toggleWishlistRequest(detailId)));
          dispatch(fetchWishlistRequest());
          setSelected([]);
          setEditMode(false);
          showSuccess('Removed selected items');
        } else {
          // Clear all: remove each item
          items.forEach((it) => dispatch(toggleWishlistRequest(it.detailId)));
          dispatch(fetchWishlistRequest());
          setSelected([]);
          setEditMode(false);
          showSuccess('Cleared wishlist');
        }
        setConfirmConfig(null);
      }
    });
  };

  // Normalize data to match ProductList expectations
  const normalizedProducts = useMemo(() => {
    return items.map((item) => ({
      detailId: item.detailId,
      productTitle: item.productTitle || '',
      productSlug: item.productSlug || '',
      price: Number.isFinite(item.price) ? item.price : 0,
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
      colors: Array.isArray(item.colors) ? item.colors.filter(Boolean) : [],
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      colorName: item.colorName || '',
    }));
  }, [items]);

  return (
    <>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">
            {items.length} Wishlist
          </h2>
          <div className="space-x-2">
            <button
              onClick={handleEditClick}
              className="text-gray-500 border-b border-gray-500"
            >
              {editMode ? "cancel" : "edit"}
            </button>
            <button
              onClick={handleClearClick}
              className="text-gray-500 border-b border-gray-500"
            >
              clear all
            </button>
          </div>
        </div>
        {loading ? (
          <ProductList products={[]} isLoading={true} onProductClick={() => {}} />
        ) : editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const firstImage = item.imageUrls?.[0] ?? "";
              const secondImage = item.imageUrls?.[1] ?? null;
              const formatPrice = (price: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(price);
              return (
                <div
                  key={item.detailId}
                  className="group cursor-pointer relative"
                  onClick={() => {
                    if (!editMode) router.push(`/products/${item.detailId}`);
                  }}
                >
                  <input
                    type="checkbox"
                    className={`absolute top-2 left-2 w-5 h-5 z-10 appearance-none border-2 border-gray-400 rounded bg-white checked:bg-black checked:border-black flex items-center justify-center transition-colors duration-200`}
                    checked={selected.includes(item.detailId)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelected((prev) =>
                        prev.includes(item.detailId)
                          ? prev.filter((s) => s !== item.detailId)
                          : [...prev, item.detailId]
                      );
                    }}
                  />
                  {selected.includes(item.detailId) && (
                    <svg
                      className="absolute top-2 left-2 w-5 h-5 z-20 pointer-events-none"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10.5L9 14.5L15 7.5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                    {firstImage ? (
                      <>
                        <div
                          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
                          style={{ backgroundImage: `url(${firstImage})` }}
                        />
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
                  <div className="space-y-2">
                    <h3 className="font-medium text-black text-sm line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {item.productTitle}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-black">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full ${
                            color === "black"
                              ? "bg-black"
                              : color === "white"
                              ? "bg-white border border-black"
                              : color === "red"
                              ? "bg-red-500"
                              : color === "blue" || color === "dark blue"
                              ? "bg-blue-500"
                              : color === "mint"
                              ? "bg-green-300"
                              : color === "brown"
                              ? "bg-amber-700"
                              : color === "yellow"
                              ? "bg-yellow-400"
                              : color === "pink"
                              ? "bg-pink-400"
                              : "bg-gray-400"
                          }`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ProductList
            products={normalizedProducts}
            isLoading={loading}
            onProductClick={(detailId, slug) => router.push(`/products/${detailId}`)}
          />
        )}
      </div>
      {confirmConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-sm w-full">
            <p className="mb-4 text-center">{confirmConfig.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmConfig(null)}
                className="w-[20vh] px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="w-[20vh] px-4 py-2 bg-black text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


