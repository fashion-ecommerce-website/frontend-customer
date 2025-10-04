"use client";

import React, { Fragment, useMemo } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { ProductFilters, FilterDropdownOption } from "../types";

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onOpenSidebar?: () => void;
  // Optional title (from parent or URL param). If provided, used in breadcrumb.
  title?: string;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  onOpenSidebar,
  title,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const breadcrumbTitle = useMemo(() => {
    // Priority: prop > URL param 'name'/'title' > formatted category
    if (title && title.trim().length > 0) return title;
    const paramName = searchParams?.get('name') || searchParams?.get('title');
    if (paramName && paramName.trim().length > 0) return paramName;
    // format slug: ao-thun -> AO THUN
    const parts = (filters.category || '').replace(/_/g, '-').split('-').filter(Boolean);
    const formatted = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    return formatted.toUpperCase();
  }, [title, filters.category, searchParams]);

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleCategoryClick = () => {
    // Navigate to product listing filtered by category
    const category = filters.category || '';
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleTitleClick = () => {
    // Navigate to product listing with category and name/title param
    const category = filters.category || '';
    router.push(`/products?category=${encodeURIComponent(category)}&name=${encodeURIComponent(breadcrumbTitle)}`);
  };
  const sortOptions: FilterDropdownOption[] = [
    { value: "productTitle_asc", label: "Name: A-Z" },
    { value: "productTitle_desc", label: "Name: Z-A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Oldest" },
    { value: "popular", label: "Newest" },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs sm:text-sm gap-1 order-2 sm:order-1">
        <span
          role="button"
          tabIndex={0}
          onClick={handleHomeClick}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleHomeClick()}
          className="text-gray-600 cursor-pointer"
        >HOME</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="7"
          height="11"
          viewBox="0 0 7 11"
          fill="none"
        >
          <path
            d="M1 1L5.5 5.5L1 10"
            stroke="#787878"
            strokeLinecap="square"
          ></path>
        </svg>
        <span
          role="button"
          tabIndex={0}
          onClick={handleCategoryClick}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCategoryClick()}
          className="text-gray-600 cursor-pointer"
        >CATEGORY</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="7"
          height="11"
          viewBox="0 0 7 11"
          fill="none"
        >
          <path
            d="M1 1L5.5 5.5L1 10"
            stroke="#787878"
            strokeLinecap="square"
          ></path>
        </svg>
        <span
          role="button"
          tabIndex={0}
          onClick={handleTitleClick}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTitleClick()}
          className="font-medium text-gray-900 cursor-pointer"
        >{breadcrumbTitle}</span>
      </div>

      {/* Filter Button and Sort Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
        {/* Filter Button */}
        <button
          onClick={onOpenSidebar}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-black text-sm flex-1 sm:flex-none justify-center"
        >
          Filters
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </button>

        {/* Sort Dropdown */}
        <Listbox
          value={filters.sort || sortOptions[0].value}
          onChange={(value) => handleFilterChange("sort", value)}
        >
          <div className="relative flex-1 sm:flex-none">
            <ListboxButton className="flex items-center justify-between w-full sm:w-48 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white text-black text-sm">
              <span className="truncate">
                {sortOptions.find((opt) => opt.value === filters.sort)?.label ||
                  sortOptions[0].label}
              </span>
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-black ml-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                />
              </svg>
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-400 rounded-[8px] shadow-2xl max-h-60 z-20">
                {sortOptions.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className={({ focus }) =>
                      `cursor-pointer select-none px-4 py-1 rounded-[8px] ${
                        focus ? "bg-black text-white" : "bg-white text-black"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex justify-between items-center">
                        <span
                          className={selected ? "font-medium" : "font-normal"}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};
