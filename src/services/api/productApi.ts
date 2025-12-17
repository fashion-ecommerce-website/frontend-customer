import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Product item interface - matches actual API response with promotion
export interface ProductItem {
  quantity: number;
  price: number;          // base price
  finalPrice: number;     // after promotion
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
  colors: string[];
  productTitle: string;
  productSlug: string;
  colorName: string;
  sizeName: string;
  detailId: number;
  imageUrls: string[];
}

// Product detail interface - matches the new API response format with promotion
export interface ProductDetail {
  detailId: number;
  productId: number; 
  title: string;
  price: number;          // base price
  finalPrice: number;     // after promotion
  percentOff?: number;    
  promotionId?: number;   
  promotionName?: string; 
  activeColor: string;
  activeSize?: string;
  images: string[];
  colors: string[];
  mapSizeToQuantity: { [size: string]: number };
  description: string[];
  category?: string;
  categorySlug: string; 
}

// Legacy interface for backward compatibility (deprecated)
export interface LegacyProductDetail {
  id: number;
  productTitle: string;
  productSlug: string;
  price: number;
  originalPrice?: number;
  colors: string[];
  sizes: string[];
  imageUrls: string[];
  description?: string;
  features?: string[];
  specifications?: string[];
  category: string;
  isInStock: boolean;
  quantity: number;
  styleCode?: string;
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
// Note: page is 1-based in UI, will be converted to 0-based for server
export interface ProductsRequest {
  category?: string;  // Optional - backend supports search without category
  page?: number;     // 1-based page number (UI), converted to 0-based for server
  pageSize?: number;
  colors?: string[]; // Nhiều màu thì: ?colors=Red&colors=Blue
  sizes?: string[];  // sizes tương tự như màu
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;    // Có 4 cases: <1m, 1-2m, 2-3m, >4m
  title?: string;    // keyword search theo tên
}

// Discounted products request interface
export interface DiscountedProductsRequest {
  page?: number;     // 1-based page number (UI), converted to 0-based for server
  pageSize?: number;
  colors?: string[]; // Multiple colors: ?colors=black&colors=red
  sizes?: string[];  // Multiple sizes: ?sizes=L&sizes=M
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;    // Price range: <1m, 1-2m, 2-3m, >4m
  title?: string;    // Keyword search by title
}

// Product API endpoints
const PRODUCT_ENDPOINTS = {
  GET_PRODUCTS: '/products',
  GET_DISCOUNTED_PRODUCTS: '/products/discounted',
  GET_PRODUCT_BY_ID: '/products',
  GET_PRODUCT_BY_COLOR: '/products/details', // GET /products/details/{id}/color?activeColor={color}
  GET_DISCOUNTED_PRODUCTS: '/products/discounted',
} as const;

// Product API service
export class ProductApiService {
  /**
   * Get product by ID
   * URL example: /products/123
   */
  async getProductById(id: string): Promise<ApiResponse<ProductDetail>> {
    const url = `${PRODUCT_ENDPOINTS.GET_PRODUCT_BY_ID}/details/${id}`;
    return apiClient.get<ProductDetail>(url);
  }

  /**
   * Get product by ID and color
   * URL example: /products/1/color?activeColor=white
   */
  async getProductByColor(id: string, activeColor: string, activeSize?: string): Promise<ApiResponse<ProductDetail>> {
    const search = new URLSearchParams({ activeColor });
    if (activeSize) search.append('activeSize', activeSize);
    const url = `${PRODUCT_ENDPOINTS.GET_PRODUCT_BY_COLOR}/${id}/color?${search.toString()}`;
    return apiClient.get<ProductDetail>(url);
  }

  /**
   * Get discounted products (sale products) with filters
   * URL example: /products/discounted?page=0&pageSize=12&sort=price_asc
   * Note: UI sends page=1, converted to page=0 for server
   */
  async getDiscountedProducts(params?: Omit<ProductsRequest, 'category'>): Promise<ApiResponse<PaginatedProductsResponse>> {
    const searchParams = new URLSearchParams();

    // Pagination - Convert from UI (1-based) to Server (0-based)
    if (params?.page) {
      const serverPage = params.page - 1;
      searchParams.append('page', serverPage.toString());
    }

    // Page size
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    // Colors filter
    if (params?.colors && params.colors.length > 0) {
      params.colors.forEach(color => {
        searchParams.append('colors', color);
      });
    }

    // Sizes filter
    if (params?.sizes && params.sizes.length > 0) {
      params.sizes.forEach(size => {
        searchParams.append('sizes', size);
      });
    }

    // Sort
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    // Price range
    if (params?.price) {
      searchParams.append('price', params.price);
    }

    // Title search
    if (params?.title) {
      searchParams.append('title', params.title);
    }

    const url = searchParams.toString()
      ? `${PRODUCT_ENDPOINTS.GET_DISCOUNTED_PRODUCTS}?${searchParams.toString()}`
      : PRODUCT_ENDPOINTS.GET_DISCOUNTED_PRODUCTS;

    return apiClient.get<PaginatedProductsResponse>(url);
  }

  /**
   * Get paginated products with filters
   * URL example: /products?category=ao-thun&page=0&pageSize=12&sort=productTitle_asc
   * Note: UI sends page=1, converted to page=0 for server
   */
  async getProducts(params?: ProductsRequest): Promise<ApiResponse<PaginatedProductsResponse>> {
    const searchParams = new URLSearchParams();

    // Category filter - Optional, backend supports search without category
    if (params?.category) {
      searchParams.append('category', params.category);
    }

    // Pagination - Convert from UI (1-based) to Server (0-based)
    if (params?.page) {
      const serverPage = params.page - 1; // Convert: UI page 1 → Server page 0
      searchParams.append('page', serverPage.toString());
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

  /**
   * Get discounted products with filters
   * URL example: /products/discounted?page=0&pageSize=12&colors=black&colors=red&sizes=L&sort=productTitle_asc&price=1-2m&title=áo thun
   * Note: UI sends page=1, converted to page=0 for server
   */
  async getDiscountedProducts(params?: DiscountedProductsRequest): Promise<ApiResponse<PaginatedProductsResponse>> {
    const searchParams = new URLSearchParams();

    // Pagination - Convert from UI (1-based) to Server (0-based)
    if (params?.page) {
      const serverPage = params.page - 1;
      searchParams.append('page', serverPage.toString());
    }

    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    // Colors filter - Multiple: ?colors=black&colors=red
    if (params?.colors && params.colors.length > 0) {
      params.colors.forEach(color => {
        searchParams.append('colors', color);
      });
    }

    // Sizes filter - Multiple: ?sizes=L&sizes=M
    if (params?.sizes && params.sizes.length > 0) {
      params.sizes.forEach(size => {
        searchParams.append('sizes', size);
      });
    }

    // Sort
    if (params?.sort) {
      searchParams.append('sort', params.sort);
    }

    // Price range
    if (params?.price) {
      searchParams.append('price', params.price);
    }

    // Title search
    if (params?.title) {
      searchParams.append('title', params.title);
    }

    const url = searchParams.toString()
      ? `${PRODUCT_ENDPOINTS.GET_DISCOUNTED_PRODUCTS}?${searchParams.toString()}`
      : PRODUCT_ENDPOINTS.GET_DISCOUNTED_PRODUCTS;

    return apiClient.get<PaginatedProductsResponse>(url);
  }
}

// Export singleton instance
export const productApiService = new ProductApiService();

// Export API functions for saga factories
export const productApi = {
  getProducts: (params?: ProductsRequest) => productApiService.getProducts(params),
  getDiscountedProducts: (params?: Omit<ProductsRequest, 'category'>) => productApiService.getDiscountedProducts(params),
  getProductById: (id: string) => productApiService.getProductById(id),
  getProductByColor: (id: string, activeColor: string, activeSize?: string) => productApiService.getProductByColor(id, activeColor, activeSize),
  getDiscountedProducts: (params?: DiscountedProductsRequest) => productApiService.getDiscountedProducts(params),
};
