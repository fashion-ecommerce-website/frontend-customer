import { ProductDetail } from '@/services/api/productApi';

export interface ProductDetailState {
  product: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
  isColorLoading: boolean; // Separate loading for color changes
}

export interface ProductDetailProps {
  productId: string;
}

export type { ProductDetail };