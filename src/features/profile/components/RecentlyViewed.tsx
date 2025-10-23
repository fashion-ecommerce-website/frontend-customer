"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductList } from "@/features/filter-product/components";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export const RecentlyViewed: React.FC = () => {
  const router = useRouter();
  const { items, loading, error, clearAll, deleteItems } = useRecentlyViewed();
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Display error if fetch failed
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Use ProductList to render items or loading state
  const handleEditClick = () => {
    setEditMode((prev) => {
      if (prev) {
        setSelected([]);
      }
      return !prev;
    });
  };

  const handleClearClick = () => {
    const count = editMode && selected.length > 0 ? selected.length : items.length;
    const message = editMode && selected.length > 0
      ? `Are you sure you want to delete ${count} selected items?`
      : 'Are you sure you want to clear all recently viewed items?';
    setConfirmConfig({
      message,
      onConfirm: async () => {
        if (editMode && selected.length > 0) {
          await deleteItems(selected);
          setSelected([]);
          setEditMode(false);
        } else {
          await clearAll();
        }
        setConfirmConfig(null);
      }
    });
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">
            {items.length} Recently Viewed
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
                    {/* Promotion Badge */}
                    {item.percentOff && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold rounded shadow-lg w-10 h-6 flex items-center justify-center">
                        -{item.percentOff}%
                      </div>
                    )}
                    
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
                    <div className="flex items-center gap-2">
                      {item.finalPrice && item.finalPrice < item.price ? (
                        <>
                          <div className="text-lg font-bold text-red-600">
                            {item.finalPrice.toLocaleString('vi-VN')}₫
                          </div>
                          <div className="text-sm line-through text-gray-500">
                            {item.price.toLocaleString('vi-VN')}₫
                          </div>
                        </>
                      ) : (
                        <div className="text-lg font-bold text-black">
                          {item.price.toLocaleString('vi-VN')}₫
                        </div>
                      )}
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
            products={items}
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
