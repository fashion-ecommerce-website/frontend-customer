/**
 * Virtual Try-On Feature Barrel Export
 */

// Export containers
export { VirtualTryOnContainer } from './containers/VirtualTryOnContainer';

// Export components
export { VirtualTryOnPresenter } from './components/VirtualTryOnPresenter';
export { ImageUpload } from './components/ImageUpload';
export { ProductSelector } from './components/ProductSelector';
export { TryOnResult } from './components/TryOnResult';

// Export types
export type {
  VirtualTryOnProduct,
  VirtualTryOnContainerProps,
  VirtualTryOnPresenterProps,
  ImageUploadProps,
  ProductSelectorProps,
  TryOnResultProps,
} from './types';
