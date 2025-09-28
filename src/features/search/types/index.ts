export interface SearchFilters {
  title?: string;       // Search keyword
  category?: string;    // Product category
  page?: number;
  pageSize?: number;
  colors?: string[];
  sizes?: string[];
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  results: SearchResultItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface SearchResultItem {
  quantity: number;
  price: number;
  colors: string[];
  productTitle: string;
  productSlug: string;
  colorName: string;
  detailId: number;
  imageUrls: string[];
}

export interface SearchResponse {
  items: SearchResultItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}