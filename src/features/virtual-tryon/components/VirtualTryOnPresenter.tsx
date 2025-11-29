"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VirtualTryOnPresenterProps } from "../types";
import { ImageUpload } from "./ImageUpload";
import { ProductSelector } from "./ProductSelector";
import { TryOnResult } from "./TryOnResult";
import { TryOnHistory } from "./TryOnHistory";

export const VirtualTryOnPresenter: React.FC<VirtualTryOnPresenterProps> = ({
  products,
  selectedProduct,
  selectedLowerProduct,
  userImage,
  resultImage,
  isProcessing,
  error,
  history,
  category,
  activeSlot,
  onProductSelect,
  onImageUpload,
  onTryOn,
  onReset,
  onHistorySelect,
  onCategoryChange,
  onActiveSlotChange,
}) => {
  const [activeTab, setActiveTab] = useState<'try-on' | 'history'>('try-on');

  const breadcrumbItems = [
    {
      label: "HOME",
      className: "text-gray-400 font-semibold font-[12px]",
      href: "/",
    },
    {
      label: "SHOPPING CART",
      className: "text-gray-400 font-semibold font-[12px]",
      href: "/cart",
    },
    {
      label: "VIRTUAL TRY-ON",
      className: "text-black font-semibold font-[12px]",
      href: "/cart/virtual-tryon",
    },
  ];

  const canTryOn: boolean = !!(
    userImage &&
    selectedProduct &&
    !isProcessing &&
    !resultImage
  );

  const handleHistoryItemSelect = (item: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onHistorySelect(item as any);
    setActiveTab('try-on');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-center sm:self-auto">
            <button
              onClick={() => setActiveTab('try-on')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'try-on'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              New Try-On
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Status bar (top-right) - Only show in try-on tab */}
        {activeTab === 'try-on' && (
          <div className="absolute right-60 top-6 hidden sm:flex items-center">
            {isProcessing ? (
              <div className="inline-flex items-center gap-3 bg-gray-50 text-black px-3 py-2 rounded-full border border-gray-200 shadow-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            ) : resultImage ? (
              <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'history' ? (
            <TryOnHistory history={history} onSelect={handleHistoryItemSelect} />
          ) : !resultImage ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* Left Column - Product Selection */}
              <div className="space-y-6 h-full">
                <div className="bg-white p-6 h-full flex flex-col border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          selectedProduct
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {selectedProduct ? "✓" : "1"}
                      </div>
                      <h2 className="text-xl font-bold text-black tracking-tight">
                        SELECT ITEM
                      </h2>
                    </div>
                  </div>

                  {/* Category Selector */}
                  <div className="mb-6">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                      Try-On Mode
                    </label>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-lg overflow-x-auto">
                      {(['upper', 'lower', 'combo'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => onCategoryChange(cat)}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                            category === cat
                              ? 'bg-white text-black shadow-sm border border-gray-200'
                              : 'text-gray-500 hover:text-black hover:bg-gray-100'
                          }`}
                        >
                          {cat === 'combo' ? 'Combo' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Combo Mode Slots */}
                  {category === 'combo' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div 
                        onClick={() => onActiveSlotChange('upper')}
                        className={`p-3 rounded-xl border-2 transition-all text-black cursor-pointer relative ${
                          activeSlot === 'upper' 
                            ? 'border-black bg-white' 
                            : 'border-dashed border-gray-500 bg-gray-50 hover:border-black'
                        }`}
                      >
                        <div className="text-xs font-semibold text-black uppercase mb-2 flex justify-between">
                          <span>Upper</span>
                          {activeSlot === 'upper' && <span className="text-black">● Active</span>}
                        </div>
                        {selectedProduct ? (
                          <div className="flex items-center gap-2">
                            <img src={selectedProduct.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-smfont-medium truncate">{selectedProduct.productTitle}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-center py-2">Select Top</div>
                        )}
                      </div>
                      
                      <div 
                        onClick={() => onActiveSlotChange('lower')}
                        className={`p-3 rounded-xl border-2 transition-all text-black cursor-pointer relative ${
                          activeSlot === 'lower' 
                            ? 'border-black bg-white' 
                            : 'border-dashed border-gray-500 bg-gray-50 hover:border-black'
                        }`}
                      >
                        <div className="text-xs font-semibold text-black uppercase mb-2 flex justify-between">
                          <span>Lower</span>
                          {activeSlot === 'lower' && <span className="text-black">● Active</span>}
                        </div>
                        {selectedLowerProduct ? (
                          <div className="flex items-center gap-2">
                            <img src={selectedLowerProduct.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{selectedLowerProduct.productTitle}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-center py-2">Select Bottom</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-auto">
                    <ProductSelector
                      products={products}
                      selectedProduct={
                        category === 'lower' || (category === 'combo' && activeSlot === 'lower')
                          ? selectedLowerProduct
                          : selectedProduct
                      }
                      onProductSelect={onProductSelect}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload & Try On */}
              <div className="h-full flex flex-col space-y-6">
                <div className="flex flex-col h-full bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        userImage
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {userImage ? "✓" : "2"}
                    </div>
                    <h2 className="text-xl font-bold text-black tracking-tight">
                      UPLOAD PHOTO
                    </h2>
                  </div>

                  <ImageUpload
                    onImageUpload={onImageUpload}
                    userImage={userImage}
                    disabled={isProcessing}
                    onTryOn={onTryOn}
                    canTryOn={canTryOn}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Result View - Full Width */
            <div className="bg-white">
              <TryOnResult
                resultImage={resultImage}
                isProcessing={isProcessing}
                onReset={onReset}
                selectedProduct={selectedProduct}
                selectedLowerProduct={selectedLowerProduct}
                userImage={userImage}
              />
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

