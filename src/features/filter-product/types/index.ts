export interface FilterProductItem {
  quantity: number;
  price: number;          // base price
  finalPrice?: number;     // after promotion
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
  colors: string[];
  productTitle: string;
  productSlug: string;
  colorName: string;
  detailId: number;
  imageUrls: string[];
}

export interface FilterProductResponse {
  items: FilterProductItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductFilters {
  category: string;  // Required to match API requirement
  page?: number;
  pageSize?: number;
  colors?: string[];
  sizes?: string[];
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;
  title?: string;
}

export interface FilterDropdownOption {
  value: string;
  label: string;
}

export interface FilterProductState {
  products: FilterProductItem[];
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
