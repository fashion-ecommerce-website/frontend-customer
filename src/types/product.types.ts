// Shared Product Types
// Used across multiple features and components

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;          // base price
  finalPrice?: number;    // after promotion
  originalPrice?: number;  // legacy field for backward compatibility
  discount?: number;       // legacy field for backward compatibility
  percentOff?: number;    // integer percent
  promotionId?: number;   // nullable
  promotionName?: string; // nullable
  image: string;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  image?: string;
}
