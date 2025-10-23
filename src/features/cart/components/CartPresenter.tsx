"use client";

// Cart Presenter Component
// Presentational component for cart page UI

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CartItemComponent } from "./CartItem";
import { CartItemSkeleton } from "./CartItemSkeleton";
import { CartSummaryComponent } from "./CartSummary";
import { CartPresenterProps } from "../types";

export const CartPresenter: React.FC<CartPresenterProps> = ({
  cartItems,
  cartSummary,
  loading,
  error,
  allItemsSelected,
  onRemoveItem,
  onSelectItem,
  onUnselectItem,
  onSelectAll,
  onUnselectAll,
  onCheckout,
  onContinueShopping,
  onClearError,
  onEditItem,
  note,
  onNoteChange,
}) => {
  const router = useRouter();
  
  const breadcrumbItems = [
    {
      label: "HOME",
      className: "text-gray-400 font-semibold font-[12px]",
      href: "/",
    },
    {
      label: "SHOPPING CART",
      className: "text-black font-semibold font-[12px]",
      href: "/cart",
    },
  ];

  // Handle select all toggle
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectAll();
    } else {
      onUnselectAll();
    }
  };

  // Empty cart state
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="text-center py-8 sm:py-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-black">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Add products to your cart to continue shopping
            </p>
            <button
              onClick={onContinueShopping}
              className="bg-black text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 rounded-lg relative">
            <span className="block sm:inline text-sm sm:text-base">
              {error}
            </span>
            <button
              onClick={onClearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-red-100 transition-colors"
              aria-label="Dismiss error"
            >
              <span className="sr-only">Dismiss</span>✕
            </button>
          </div>
        )}

        {/* Header with select all */}
        <div className="bg-white mb-4 px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <input
              type="checkbox"
              checked={allItemsSelected}
              onChange={handleSelectAllChange}
              className="border-gray-300 w-4 h-4 sm:w-5 sm:h-5 text-gray-800 focus:ring-gray-800 accent-gray-800 transition-all duration-200"
            />
            <span className="font-semibold text-black text-sm sm:text-base">
              Select All
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg space-y-4">
              {loading && cartItems.length === 0 ? (
                // Show skeletons when loading and no items yet
                <>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </>
              ) : (
                // Show actual cart items
                cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onRemove={onRemoveItem}
                    onSelect={onSelectItem}
                    onUnselect={onUnselectItem}
                    onEdit={onEditItem}
                    loading={loading}
                  />
                ))
              )}
            </div>

            {/* Virtual Try-On Button */}
            <div className="mt-6 flex justify-center flex-col space-y-4">
              <button 
                onClick={() => router.push('/cart/virtual-tryon')}
                className="relative overflow-hidden bg-white border border-gray-200 rounded-xl p-4 w-full hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Sparkle Icon with Gradient */}
                    <div className="relative bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    
                    {/* Text Content */}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-base group-hover:tracking-wide transition-all duration-300">
                        Try On Before You Buy
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5 group-hover:text-gray-900 transition-colors duration-300">
                        Use our Virtual Try-On to see how clothes look on you
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Continue Shopping */}
              <button 
                onClick={onContinueShopping}
                className="border border-gray-300 rounded-lg p-3 w-full text-black hover:bg-gray-50 bg-white transition-colors font-medium shadow-sm hover:shadow"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <CartSummaryComponent
              summary={cartSummary}
              onCheckout={onCheckout}
              loading={loading}
              note={note}
              onNoteChange={onNoteChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
