import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Product item interface - matches actual API response
export interface ProductItem {
  quantity: number;
  price: number;
  colors: string[];
  productTitle: string;
  productSlug: string;
  colorName: string;
  detailId: number;
  imageUrls: string[];
}

// Paginated products response interface
export interface PaginatedProductsResponse {
  items: ProductItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Product search/filter request interface
export interface ProductsRequest {
  category: string;  // Required - API yêu cầu bắt buộc
  page?: number;
  pageSize?: number;
  colors?: string[]; // Nhiều màu thì: ?colors=Red&colors=Blue
  sizes?: string[];  // sizes tương tự như màu
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;    // Có 4 cases: <1m, 1-2m, 2-3m, >4m
  title?: string;    // keyword search theo tên
}

// Product API endpoints
const PRODUCT_ENDPOINTS = {
  GET_PRODUCTS: '/products',
} as const;

// Product API service
export class ProductApiService {
  /**
   * Get paginated products with filters
   * URL example: /products?category=ao-thun&page=1&pageSize=12&sort=productTitle_asc
   */
  async getProducts(params?: ProductsRequest): Promise<ApiResponse<PaginatedProductsResponse>> {
    const searchParams = new URLSearchParams();
    
    // Category filter - Required parameter, use default if not provided
    const category = params?.category || 'ao-thun'; // Default category
    searchParams.append('category', category);
    
    // Pagination - Bắt đầu từ 0 nên FE trừ 1 trước khi gửi qua nha
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    // Page size
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    // Colors filter - Nhiều màu thì: ?colors=Red&colors=Blue
    if (params?.colors && params.colors.length > 0) {
      params.colors.forEach(color => {
        searchParams.append('colors', color);
      });
    }

    // Sizes filter - sizes tương tự như màu
    if (params?.sizes && params.sizes.length > 0) {
      params.sizes.forEach(size => {
        searchParams.append('sizes', size);
      });
    }

    // Sort - Có 4 cases: productTitle_asc, productTitle_desc, price_asc, price_desc
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    // Price range - Có 4 cases: <1m, 1-2m, 2-3m, >4m
    if (params?.price) {
      searchParams.append('price', params.price);
    }

    // Title search - keyword search theo tên
    if (params?.title) {
      searchParams.append('title', params.title);
    }

    const url = searchParams.toString() 
      ? `${PRODUCT_ENDPOINTS.GET_PRODUCTS}?${searchParams.toString()}`
      : PRODUCT_ENDPOINTS.GET_PRODUCTS;

    return apiClient.get<PaginatedProductsResponse>(url);
  }
}

// Export singleton instance
export const productApiService = new ProductApiService();

// Export API functions for saga factories
export const productApi = {
  getProducts: (params?: ProductsRequest) => productApiService.getProducts(params),
};
