/**
 * Virtual Try-On Types
 */

export interface VirtualTryOnProduct {
  id: number;
  productDetailId: number;
  productTitle: string;
  categorySlug?: string; // Category slug to auto-determine upper/lower
  colorName: string;
  sizeName: string;
  imageUrl: string;
  price: number;
}

/**
 * Fitroom API Types
 */
export type ClothType = 'upper' | 'lower' | 'full';

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface FitroomTask {
  taskId: string;
  status: TaskStatus;
  message?: string;
}

export interface FitroomTaskResult extends FitroomTask {
  resultImageUrl?: string;
  error?: string;
}

export interface VirtualTryOnContainerProps {
  products: VirtualTryOnProduct[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  product: VirtualTryOnProduct;
  userImage: string;
  resultImage: string;
}

export type TryOnCategory = 'upper' | 'lower';

export interface VirtualTryOnPresenterProps {
  products: VirtualTryOnProduct[];
  selectedProduct: VirtualTryOnProduct | null;
  selectedLowerProduct: VirtualTryOnProduct | null;
  userImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
  history: HistoryItem[];
  activeSlot: 'upper' | 'lower';
  onProductSelect: (product: VirtualTryOnProduct) => void;
  onImageUpload: (file: File) => void;
  onTryOn: () => void;
  onReset: () => void;
  onBack: () => void;
  onHistorySelect: (item: HistoryItem) => void;
  onActiveSlotChange: (slot: 'upper' | 'lower') => void;
  onClearSlot: (slot: 'upper' | 'lower') => void;
}

export interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  userImage: string | null;
  disabled?: boolean;
  onTryOn?: () => void;
  canTryOn?: boolean;
}

export interface ProductSelectorProps {
  products: VirtualTryOnProduct[];
  selectedProduct: VirtualTryOnProduct | null;
  onProductSelect: (product: VirtualTryOnProduct) => void;
  disabled?: boolean;
}

export interface TryOnResultProps {
  resultImage: string | null;
  isProcessing: boolean;
  onReset: () => void;
  selectedProduct?: VirtualTryOnProduct | null;
  selectedLowerProduct?: VirtualTryOnProduct | null;
  userImage?: string | null;
}

