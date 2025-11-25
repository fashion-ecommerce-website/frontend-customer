export interface SaleProductItem {
  quantity: number;
  price: number;
  finalPrice?: number;
  percentOff?: number;
  promotionId?: number;
  promotionName?: string;
  colors: string[];
  productTitle: string;
  productSlug: string;
  colorName: string;
  detailId: number;
  imageUrls: string[];
}

export interface SaleProductResponse {
  items: SaleProductItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SaleFilters {
  page?: number;
  pageSize?: number;
  colors?: string[];
  sizes?: string[];
  sort?: 'productTitle_asc' | 'productTitle_desc' | 'price_asc' | 'price_desc';
  price?: string;
  title?: string;
}
