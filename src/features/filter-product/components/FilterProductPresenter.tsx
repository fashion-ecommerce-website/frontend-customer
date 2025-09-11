'use client';

import React, { useEffect, useState } from 'react';
import { ProductFilter } from './ProductFilter';
import { FilterSidebar } from './FilterSidebar';
import { ProductList } from './ProductList';
import { Pagination } from './Pagination';
import { ProductFilters, FilterProductItem } from '../types';
import { productApi } from '../../../services/api/productApi';

interface FilterProductPresenterProps {
  onProductClick: (slug: string) => void;
}

export const FilterProductPresenter: React.FC<FilterProductPresenterProps> = ({
  onProductClick
}) => {
  const [products, setProducts] = useState<FilterProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'ao-thun', // Default category to fix API required parameter
    page: 1,
    pageSize: 12
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });

  const fetchProducts = async (searchFilters: ProductFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getProducts(searchFilters);
      
      if (response.success && response.data) {
        setProducts(response.data.items);
        setPagination({
          page: response.data.page,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        });
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải sản phẩm');
        setProducts([]);
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, []);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    const updatedFilters = {
      ...newFilters,
      category: newFilters.category || 'ao-thun', // Ensure category is always set
      page: 1 // Reset to first page when filters change
    };
    setFilters(updatedFilters);
  };

  const handleSearch = () => {
    fetchProducts(filters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = {
      ...filters,
      page
    };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-black px-4 py-3 relative mb-6 rounded-lg">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={handleClearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:text-black"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Header với Breadcrumb và Sort */}
      <ProductFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
      />

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6 mt-6">
        <div className="text-sm text-black">
          {!isLoading && (
            <>
              Hiển thị {products.length > 0 ? ((pagination.page - 1) * pagination.pageSize + 1) : 0} - {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} 
              {' '}trong tổng số {pagination.totalItems} sản phẩm
            </>
          )}
        </div>
        
        <div className="text-sm text-black">
          Trang {pagination.page} / {pagination.totalPages}
        </div>
      </div>

      {/* Product List */}
      <ProductList
        products={products}
        isLoading={isLoading}
        onProductClick={onProductClick}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
