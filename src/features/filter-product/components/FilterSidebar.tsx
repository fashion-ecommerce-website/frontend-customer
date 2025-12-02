"use client"

import type React from "react"
import { useState } from "react"
import type { ProductFilters, FilterDropdownOption } from "../types"

type FilterValue = ProductFilters[keyof ProductFilters];

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  productCount?: number
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, filters, onFiltersChange, productCount }) => {
  const [searchTitle, setSearchTitle] = useState(filters.title || "")
  const [expandedSections, setExpandedSections] = useState({
    colors: false,
    category: false,
    sizes: false,
    price: false,
  })

  const colorOptions: FilterDropdownOption[] = [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "red", label: "Red" },
    { value: "gray", label: "Gray" },
    { value: "blue", label: "Blue" },
    { value: "pink", label: "Pink" },
    { value: "yellow", label: "Yellow" },
    { value: "purple", label: "Purple" },
    { value: "brown", label: "Brown" },
    { value: "green", label: "Green" },
    { value: "beige", label: "Beige" },
    { value: "orange", label: "Orange" },
    { value: "checkered", label: "Checkered" },
  ]

  const sizeOptions: FilterDropdownOption[] = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ]

  const shoeSizeOptions: FilterDropdownOption[] = [
    { value: "36.5", label: "36.5" },
    { value: "37.5", label: "37.5" },
    { value: "38", label: "38" },
    { value: "38.5", label: "38.5" },
    { value: "39", label: "39" },
    { value: "40.5", label: "40.5" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "42.5", label: "42.5" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "44.5", label: "44.5" },
    { value: "45", label: "45" },
    { value: "45.5", label: "45.5" },
    { value: "46", label: "46" },
  ]

  const priceOptions: FilterDropdownOption[] = [
    { value: "", label: "All prices" },
    { value: "<1m", label: "Under 1 million VND" },
    { value: "1-2m", label: "1-2 million VND" },
    { value: "2-3m", label: "2-3 million VND" },
    { value: ">4m", label: "Over 4 million VND" },
  ]

  const categoryOptions: FilterDropdownOption[] = [
    { value: "ao-thun", label: "T-shirt" },
    { value: "ao-polo", label: "Polo shirt" },
    { value: "ao-hoodie", label: "Hoodie" },
  ]

  const handleFilterChange = (key: keyof ProductFilters, value: FilterValue) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handleMultiSelectChange = (key: "colors" | "sizes", value: string) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    handleFilterChange(key, newValues.length > 0 ? newValues : undefined)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSearchSubmit = () => {
    handleFilterChange("title", searchTitle || undefined)
    // Auto-search will be triggered by filter change
  }

  const clearFilters = () => {
    setSearchTitle("")
    onFiltersChange({
      category: "ao-thun",
      page: 1,
      pageSize: 12,
    })
  }

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
          <h3 className="text-lg font-medium text-black">Filters</h3>
          <button onClick={onClose} className="text-black hover:text-gray-600 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Colors */}
          <div>
            <button
              onClick={() => toggleSection("colors")}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3 "
            >
              <span>Colors</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expandedSections.colors ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.colors && (
              <div className="pb-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-9 gap-6">
                  <button
                    className={`w-8 h-8 rounded-full bg-black transition-all duration-200 ${
                      filters.colors?.includes("black") ? "border-white border-2 ring-2 ring-black" : "border-black"
                    }`}
                    title="Black"
                    onClick={() => handleMultiSelectChange("colors", "black")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-white border-2 transition-all duration-200 ${
                      filters.colors?.includes("white") ? "border-white ring-2 ring-black" : "border-gray-300"
                    }`}
                    title="White"
                    onClick={() => handleMultiSelectChange("colors", "white")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#FF0000] transition-all duration-200 ${
                      filters.colors?.includes("red") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Red"
                    onClick={() => handleMultiSelectChange("colors", "red")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#CCCACA] transition-all duration-200 ${
                      filters.colors?.includes("gray") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Gray"
                    onClick={() => handleMultiSelectChange("colors", "gray")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#5100FF] transition-all duration-200 ${
                      filters.colors?.includes("blue") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Blue"
                    onClick={() => handleMultiSelectChange("colors", "blue")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#DB999B] transition-all duration-200 ${
                      filters.colors?.includes("pink") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Pink"
                    onClick={() => handleMultiSelectChange("colors", "pink")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#FFFF05] transition-all duration-200 ${
                      filters.colors?.includes("yellow") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Yellow"
                    onClick={() => handleMultiSelectChange("colors", "yellow")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#B5129A] transition-all duration-200 ${
                      filters.colors?.includes("purple") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Purple"
                    onClick={() => handleMultiSelectChange("colors", "purple")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#753A3A] transition-all duration-200 ${
                      filters.colors?.includes("brown") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Brown"
                    onClick={() => handleMultiSelectChange("colors", "brown")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#3CFA08] transition-all duration-200 ${
                      filters.colors?.includes("green") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Green"
                    onClick={() => handleMultiSelectChange("colors", "green")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#DCB49E] transition-all duration-200 ${
                      filters.colors?.includes("beige") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Beige"
                    onClick={() => handleMultiSelectChange("colors", "beige")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-[#F5B505] transition-all duration-200 ${
                      filters.colors?.includes("orange") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    title="Orange"
                    onClick={() => handleMultiSelectChange("colors", "orange")}
                  />
                  <button
                    className={`w-8 h-8 rounded-full bg-white transition-all duration-200 ${
                      filters.colors?.includes("checkered") ? "border-black ring-2 ring-black" : "border-gray-800"
                    }`}
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, black 0px, black 2px, white 2px, white 4px)",
                    }}
                    title="Checkered"
                    onClick={() => handleMultiSelectChange("colors", "checkered")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <button
              onClick={() => toggleSection("sizes")}
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3"
            >
              <span>Sizes</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expandedSections.sizes ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.sizes && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Clothing */}
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Clothing</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {sizeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`h-8 px-2 text-sm border rounded transition-all duration-200 hover:scale-105 ${
                          filters.sizes?.includes(option.value)
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-gray-400"
                        }`}
                        onClick={() => handleMultiSelectChange("sizes", option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footwear */}
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Footwear</h4>
                  <div className="grid grid-cols-6 gap-1">
                    {shoeSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`h-8 px-1 text-xs border rounded transition-all duration-200 hover:scale-105 ${
                          filters.sizes?.includes(option.value)
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-gray-400"
                        }`}
                        onClick={() => handleMultiSelectChange("sizes", option.value)}
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
              className="w-full flex items-center justify-between text-sm font-medium text-black mb-3"
            >
              <span>Price</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expandedSections.price ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                      checked={filters.price === option.value || (!filters.price && option.value === "")}
                      onChange={() => handleFilterChange("price", option.value || undefined)}
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
          {(filters.colors?.length || filters.sizes?.length || (filters.price && filters.price !== "") || filters.title) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-black mb-2">Selected Filters</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {/* Clear All filter item */}
                <button
                  onClick={clearFilters}
                  className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <span className="mr-1">Clear All</span>
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Title filter */}
                {filters.title && (
                  <button
                    onClick={() => {
                      setSearchTitle("")
                      handleFilterChange("title", undefined)
                    }}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">Title: {filters.title}</span>
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    <span className="mr-1">Color: {colorOptions.find(opt => opt.value === color)?.label}</span>
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                
                {/* Price filter */}
                {filters.price && filters.price !== "" && (
                  <button
                    onClick={() => handleFilterChange("price", undefined)}
                    className="flex items-center bg-gray-200 text-black text-xs px-2 py-1 rounded-lg border-2 border-gray-300 hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="mr-1">Price: {priceOptions.find(opt => opt.value === filters.price)?.label}</span>
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          
          {(filters.colors?.length || filters.sizes?.length || (filters.price && filters.price !== "") || filters.title) && (
            <div className="text-center text-sm text-gray-600">
              <span>Showing {productCount || 0} products</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
