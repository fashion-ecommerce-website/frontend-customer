"use client";

import React, { useMemo } from "react";

export interface WishlistPresenterProps {
  items: Array<{
    detailId: number;
    productTitle: string;
    productSlug?: string;
    price: number;
    finalPrice?: number;
    percentOff?: number;
    promotionId?: number;
    promotionName?: string;
    imageUrls: string[];
    colors: string[];
    quantity?: number;
    colorName?: string | null;
  }>;
  loading: boolean;
  error: string | null;
  editMode: boolean;
  selected: number[];
  confirm: { message: string; onConfirm: () => Promise<void> } | null;
  onToggleEdit: () => void;
  onToggleSelect: (detailId: number) => void;
  onClearClick: () => void;
  onCancelConfirm: () => void;
  onProductClick: (detailId: number, slug?: string) => void;
}

export const WishlistPresenter: React.FC<WishlistPresenterProps> = ({
  items,
  loading,
  error,
  editMode,
  selected,
  confirm,
  onToggleEdit,
  onToggleSelect,
  onClearClick,
  onCancelConfirm,
  onProductClick,
}) => {
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const normalizedProducts = useMemo(() => {
    return items.map((item) => ({
      detailId: item.detailId,
      productTitle: item.productTitle || '',
      productSlug: item.productSlug || '',
      price: Number.isFinite(item.price) ? item.price : 0,
      finalPrice: item.finalPrice,
      percentOff: item.percentOff,
      promotionId: item.promotionId,
      promotionName: item.promotionName,
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : [],
      colors: (() => {
        const base = Array.isArray(item.colors) ? item.colors.filter(Boolean) : [];
        if (base.length > 0) return base;
        return item.colorName ? [item.colorName] : [];
      })(),
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      colorName: item.colorName || '',
    }));
  }, [items]);

  // Dynamic import to avoid circular dependency warnings
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ProductList } = require("@/features/filter-product/components");

  return (
    <>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between border-b-3 border-black pb-2">
          <h2 className="text-lg font-semibold text-black">
            {items.length} Wishlist
          </h2>
          <div className="space-x-2">
            <button
              onClick={onToggleEdit}
              className="text-gray-500 border-b border-gray-500"
            >
              {editMode ? "cancel" : "edit"}
            </button>
            <button
              onClick={onClearClick}
              className="text-gray-500 border-b border-gray-500"
            >
              clear all
            </button>
          </div>
        </div>
        {!loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="49" viewBox="0 0 51 49" fill="none">
              <g clipPath="url(#wishlist-1)">
                <path opacity="0.05" d="M43.8448 10.7822C46.5115 17.7689 40.9648 24.4356 39.8715 25.5289L20.9648 44.4267L23.7382 47.2L42.636 28.3022C47.8537 23.0844 46.9471 13.8933 43.836 10.7822H43.8448Z" fill="black" stroke="#231815" strokeWidth="1.09333" strokeLinejoin="round"></path>
                <path d="M50.0222 1.25333L48.7689 0L3.78223 44.9778L5.03556 46.2311L50.0222 1.25333Z" fill="#D0D0D0"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M42.8223 8.44416C37.4446 3.49305 29.1779 3.43972 23.7557 8.29305C18.1823 3.31527 9.62234 3.49305 4.28012 8.83527C-1.26655 14.3731 -1.26655 23.3508 4.28012 28.8886L13.329 37.9464L14.4846 36.7908L5.42678 27.7331C0.520117 22.8353 0.520117 14.8886 5.42678 9.99972C10.3246 5.10194 18.2712 5.10194 23.169 9.99972C23.489 10.3197 24.0046 10.3197 24.3246 9.99972C29.0801 5.24416 36.7246 5.11083 41.6579 9.60861L42.8134 8.45305L42.8223 8.44416ZM42.8935 10.8886L44.0579 9.72416C48.7601 15.2886 48.4846 23.6353 43.2401 28.8886C43.2046 28.9242 43.1601 28.9597 43.1157 28.9864L24.3246 47.7775C24.1735 47.9286 23.9601 48.0175 23.7468 48.0175C23.5335 48.0175 23.3201 47.9286 23.169 47.7775L14.5823 39.1908L15.7379 38.0353L23.7468 46.0442L42.0668 27.7242C42.0668 27.7242 42.1468 27.6531 42.1823 27.6264C46.689 23.0042 46.9201 15.7686 42.8846 10.8886H42.8935Z" fill="#D0D0D0"></path>
              </g>
              <defs>
                <clipPath id="wishlist-1">
                  <rect width="49.9111" height="48.0267" fill="white" transform="translate(0.111328)"></rect>
                </clipPath>
              </defs>
            </svg>
            <p className="mt-4 text-sm text-gray-400">No wishlist stored</p>
            <p className="mt-1 text-sm text-gray-400">Browse recommended products</p>
          </div>
        ) : loading ? (
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
                    if (!editMode) onProductClick(item.detailId, item.productSlug);
                  }}
                >
                  <input
                    type="checkbox"
                    className={`absolute top-2 left-2 w-5 h-5 z-10 appearance-none border-2 border-gray-400 rounded bg-white checked:bg-black checked:border-black flex items-center justify-center transition-colors duration-200`}
                    checked={selected.includes(item.detailId)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onToggleSelect(item.detailId)}
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
                      {(item.colors && item.colors.length > 0 ? item.colors : (item.colorName ? [item.colorName] : [])).map((color, idx) => (
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
            onProductClick={(detailId: number, slug?: string) => onProductClick(detailId, slug)}
          />
        )}
      </div>
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-sm w-full">
            <p className="mb-4 text-center">{confirm.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancelConfirm}
                className="w-[20vh] px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirm.onConfirm}
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


