"use client";

import React from "react";
import { CartSummaryComponentProps } from "../types";

export const CartSummaryComponent: React.FC<CartSummaryComponentProps> = ({
  summary,
  onCheckout,
  loading = false,
  note,
  onNoteChange,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-black">
          ORDER INFORMATION
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-black">
              {formatPrice(summary.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-medium text-black">-</span>
          </div>

          <div className="border-t-2 border-black pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-black">Total Order</span>
              <span className="text-black">{formatPrice(summary.total)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={loading || summary.itemCount === 0}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "PROCESSING..." : "CHECKOUT"}
        </button>
      </div>
      {/* Notes Section */}
      <div className="mt-6">
        <h3 className="font-medium mb-3 text-black">NOTES</h3>
        <div className="relative">
          <textarea
            placeholder="Enter order notes"
            className="w-full h-20 p-3 pb-6 border border-gray-300 rounded-[4px] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
            maxLength={2000}
            value={note || ''}
            onChange={(e) => onNoteChange && onNoteChange(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 pointer-events-none">{(note?.length || 0)}/2000</div>
        </div>
      </div>

      {/* Company Invoice Checkbox */}
      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
          />
          <span className="text-sm text-black">Issue company invoice</span>
        </label>
      </div>
    </div>
  );
};
