/**
 * Virtual Try-On Types
 */

export interface VirtualTryOnProduct {
  id: number;
  productDetailId: number;
  productTitle: string;
  colorName: string;
  sizeName: string;
  imageUrl: string;
  price: number;
}

export interface VirtualTryOnContainerProps {
  products: VirtualTryOnProduct[];
}

export interface VirtualTryOnPresenterProps {
  products: VirtualTryOnProduct[];
  selectedProduct: VirtualTryOnProduct | null;
  userImage: string | null;
  resultImage: string | null;
  isProcessing: boolean;
  error: string | null;
  onProductSelect: (product: VirtualTryOnProduct) => void;
  onImageUpload: (file: File) => void;
  onTryOn: () => void;
  onReset: () => void;
  onBack: () => void;
}

export interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  userImage: string | null;
  disabled?: boolean;
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
}
