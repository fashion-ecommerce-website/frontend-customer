"use client";

import type React from "react";
import { useState } from "react";
import type { ProductFilters, FilterDropdownOption } from "../types";
import { useColorMap } from "@/hooks/useColorMap";
import { useLanguage } from "@/hooks/useLanguage";

type FilterValue = ProductFilters[keyof ProductFilters];

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  productCount?: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  productCount,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    colors: false,
    category: false,
    sizes: false,
    price: false,
  });

  // Use ColorProvider - only API colors for filter
  const { apiColors } = useColorMap();
  const { translations } = useLanguage();
  
  // Convert apiColors to options for filter (only from database)
  const colorOptions: FilterDropdownOption[] = apiColors.map((color) => ({
    value: color.hex,
    label: color.name,
  }));

  const sizeOptions: FilterDropdownOption[] = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  const priceOptions: FilterDropdownOption[] = [
    { value: "", label: translations.filterProduct.allPrices },
    { value: "<1m", label: translations.filterProduct.under1m },
    { value: "1-2m", label: translations.filterProduct.from1to2m },
    { value: "2-3m", label: translations.filterProduct.from2to3m },
    { value: ">3m", label: translations.filterProduct.over3m },
  ];

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: FilterValue
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (key: "colors" | "sizes", value: string) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "ao-thun",
      page: 1,
      pageSize: 12,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/35 z-40 transition-all duration-250 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-100 bg-white z-50 shadow-2xl transform transition-transform duration-250 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-black">{translations.filterProduct.filters}</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors duration-200 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Colors Section */}
          <div>
            <button
              onClick={() => toggleSection("colors")}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 cursor-pointer"
            >
              <span>{translations.filterProduct.colors}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  expandedSections.colors ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedSections.colors && (
              <div className="pb-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-9 gap-4">
                  {colorOptions.map((option) => {
                    const isSelected = filters.colors?.includes(option.label);
                    const isCheckered = option.value === "checkered";
                    const isLightColor =
                      option.value === "#d6d8d3" || option.label === "white";

                    return (
                      <button
                        key={option.value}
                        title={option.label}
                        onClick={() =>
                          handleMultiSelectChange("colors", option.label)
                        }
                        className={`
                          w-8 h-8 rounded-full transition-all duration-200 relative cursor-pointer
                          ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-black"
                              : "hover:scale-110 border border-gray-200"
                          }
                          ${
                            isLightColor && !isSelected ? "border-gray-300" : ""
                          }
                        `}
                        style={{
                          backgroundColor: isCheckered ? "white" : option.value,
                          backgroundImage: isCheckered
                            ? "repeating-linear-gradient(45deg, black 0px, black 2px, white 2px, white 4px)"
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <button
              onClick={() => toggleSection("sizes")}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 cursor-pointer"
            >
              <span>{translations.filterProduct.sizes}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  expandedSections.sizes ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedSections.sizes && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Clothing */}
                <div>
                  <div className="grid grid-cols-6 gap-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`h-8 px-2 text-sm border rounded transition-all duration-200 hover:scale-105 cursor-pointer ${
                          filters.sizes?.includes(option.value)
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-gray-400"
                        }`}
                        onClick={() =>
                          handleMultiSelectChange("sizes", option.value)
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 cursor-pointer"
            >
              <span>{translations.filterProduct.price}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  expandedSections.price ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedSections.price && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                {priceOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer px-2 py-1 rounded transition-all duration-200 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="price"
                      checked={
                        filters.price === option.value ||
                        (!filters.price && option.value === "")
                      }
                      onChange={() =>
                        handleFilterChange("price", option.value || undefined)
                      }
                      className="border-gray-300 w-5 h-5 text-gray-800 focus:ring-gray-800 accent-gray-800 transition-all duration-200"
                    />
                    <span className="ml-2 text-black">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white p-4 mt-auto">
          {/* Selected Filters List */}
          {(filters.colors?.length ||
            filters.sizes?.length ||
            (filters.price && filters.price !== "") ||
            filters.title) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-black mb-2">
                {translations.filterProduct.selectedFilters}
              </h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {/* Clear All filter item */}
                <button
                  onClick={clearFilters}
                  className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <span className="mr-1">{translations.filterProduct.clearAll}</span>
                  <svg
                    className="ml-1 w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Title filter */}
                {filters.title && (
                  <button
                    onClick={() => {
                      handleFilterChange("title", undefined);
                    }}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">Title: {filters.title}</span>
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {/* Colors filter */}
                {filters.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleMultiSelectChange("colors", color)}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">
                      Color: {color}
                    </span>
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ))}

                {/* Sizes filter */}
                {filters.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleMultiSelectChange("sizes", size)}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">Size: {size}</span>
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ))}

                {/* Price filter */}
                {filters.price && filters.price !== "" && (
                  <button
                    onClick={() => handleFilterChange("price", undefined)}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">
                      Price:{" "}
                      {
                        priceOptions.find((opt) => opt.value === filters.price)
                          ?.label
                      }
                    </span>
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {(filters.colors?.length ||
            filters.sizes?.length ||
            (filters.price && filters.price !== "") ||
            filters.title) && (
            <div className="text-center text-sm text-gray-600">
              <span>{translations.filterProduct.showingProducts.replace('{count}', String(productCount || 0))}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
