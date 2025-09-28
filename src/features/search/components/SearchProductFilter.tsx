"use client";

import React from "react";
import {
  ProductFilters,
  FilterDropdownOption,
} from "../../filter-product/types";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { Fragment } from "react";

interface SearchProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onOpenSidebar?: () => void;
  searchQuery?: string;
  resultsCount?: number;
  isLoading?: boolean;
}

export const SearchProductFilter: React.FC<SearchProductFilterProps> = ({
  filters,
  onFiltersChange,
  onOpenSidebar,
  searchQuery,
  resultsCount = 0,
  isLoading = false,
}) => {
  const sortOptions: FilterDropdownOption[] = [
    { value: "productTitle_asc", label: "Name: A-Z" },
    { value: "productTitle_desc", label: "Name: Z-A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Results count and Filter/Sort controls */}
      <div className="flex items-center justify-between">
        {/* Results count */}
        <div className="text-black">
          {!isLoading && resultsCount > 0 ? (
            <>
              Found {resultsCount} products
              {searchQuery && (
                <span>
                  {" "}
                  for "
                  <span className="font-medium text-black">{searchQuery}</span>"
                </span>
              )}
            </>
          ) : !isLoading ? (
            <span className="text-gray-500">No results</span>
          ) : (
            <span className="text-gray-500">Searching...</span>
          )}
        </div>

        {/* Filter Button and Sort Dropdown */}
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <button
            onClick={onOpenSidebar}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-black"
          >
            Filters
            <svg
              className="w-4 h-4"
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
            <div className="relative">
              <ListboxButton className="flex items-center justify-between w-48 px-4 py-2 border border-gray-300 rounded-md bg-white text-black">
                <span>
                  {sortOptions.find((opt) => opt.value === filters.sort)
                    ?.label || sortOptions[0].label}
                </span>
                <svg
                  className="h-4 w-4 text-black"
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
    </div>
  );
};
