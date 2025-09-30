import { CartItem, CartSummary } from '@/types/cart.types';

// Container Props
export interface CartContainerProps {
  className?: string;
}

// Presenter Props
export interface CartPresenterProps {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  loading: boolean;
  error: string | null;
  allItemsSelected: boolean;
  onRemoveItem: (cartItemId: number) => Promise<void>;
  onSelectItem: (cartItemId: number) => void;
  onUnselectItem: (cartItemId: number) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onClearError: () => void;
  onEditItem?: (item: CartItem) => void;
  note?: string;
  onNoteChange?: (note: string) => void;
}

// Cart Item Component Props
export interface CartItemComponentProps {
  item: CartItem;
  onRemove: (cartItemId: number) => Promise<void>;
  onSelect: (cartItemId: number) => void;
  onUnselect: (cartItemId: number) => void;
  onEdit?: (item: CartItem) => void;
  loading?: boolean;
}

// Cart Summary Component Props
export interface CartSummaryComponentProps {
  summary: CartSummary;
  onCheckout: () => void;
  loading?: boolean;
  note?: string;
  onNoteChange?: (note: string) => void;
}

// Cart Call State Props
export interface CartCallStateProps {
  children: (props: {
    cartItems: CartItem[];
    cartSummary: CartSummary;
    loading: boolean;
    error: string | null;
    refreshCart: () => void;
    clearError: () => void;
  }) => React.ReactNode;
}