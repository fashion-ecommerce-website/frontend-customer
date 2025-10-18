'use client';

// Cart Container Component
// Business logic container for cart page

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { CartItem } from '@/types/cart.types';
import { removeCartItemAsync, updateCartItemAsync } from '../redux/cartSaga';
import { 
  clearError, 
  selectCartItem, 
  unselectCartItem, 
  selectAllCartItems, 
  unselectAllCartItems,
  selectAllItemsSelected 
} from '../redux/cartSlice';
import { CartPresenter } from '../components/CartPresenter';
import { CartCallState } from '../states/CartCallState';
import { CartContainerProps } from '../types';
import { ProductQuickViewModal } from '@/features/filter-product/components/ProductQuickViewModal';
import { OrderModal } from '@/components/modals/OrderModal';
import { ProductItem } from '@/services/api/productApi';

export const CartContainer: React.FC<CartContainerProps> = ({
  className = ''
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allItemsSelected = useAppSelector(selectAllItemsSelected);
  
  // Quick view modal state
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductDetailId, setSelectedProductDetailId] = useState<number | null>(null);
  const [selectedItemSize, setSelectedItemSize] = useState<string | undefined>(undefined);
  const [selectedCartItemId, setSelectedCartItemId] = useState<number | null>(null);
  const [selectedItemQuantity, setSelectedItemQuantity] = useState<number | undefined>(undefined);

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  // Note state
  const [note, setNote] = useState<string>('');

  // Handle item removal
  const handleRemoveItem = useCallback(async (cartItemId: number) => {
    return new Promise<void>((resolve) => {
      dispatch(removeCartItemAsync(cartItemId));
      // In a real app, you might want to wait for the action to complete
      // For now, we'll resolve immediately
      resolve();
    });
  }, [dispatch]);

  // Handle item selection
  const handleSelectItem = useCallback((cartItemId: number) => {
    dispatch(selectCartItem(cartItemId));
  }, [dispatch]);

  const handleUnselectItem = useCallback((cartItemId: number) => {
    dispatch(unselectCartItem(cartItemId));
  }, [dispatch]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    dispatch(selectAllCartItems());
  }, [dispatch]);

  const handleUnselectAll = useCallback(() => {
    dispatch(unselectAllCartItems());
  }, [dispatch]);

  // Handle checkout - open order modal
  const handleCheckout = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  // Handle close order modal
  const handleCloseOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    router.push('/products');
  }, [router]);

  // Handle clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle edit item - open quick view modal
  const handleEditItem = useCallback((item: CartItem) => {
    setSelectedProductDetailId(item.productDetailId);
    setSelectedItemSize(item.sizeName);
    setSelectedCartItemId(item.id);
    setSelectedItemQuantity(item.quantity);
    setIsQuickViewOpen(true);
  }, []);

  return (
    <div className={className}>
      <CartCallState>
        {({
          cartItems,
          cartSummary,
          loading,
          error,
          clearError: clearErrorFromState
        }) => (
          <>
            {(() => {
              // Map selected cart items to order products format
              const selectedProducts: ProductItem[] = cartItems
                .filter(item => item.selected !== false)
                .map(item => ({
                  detailId: item.productDetailId,
                  productTitle: item.productTitle,
                  productSlug: item.productSlug,
                  price: item.price,
                  quantity: item.quantity,
                  colors: item.colorName ? [item.colorName] : [],
                  colorName: item.colorName,
                  sizeName: item.sizeName,
                  imageUrls: item.imageUrl ? [item.imageUrl] : [],
                }));
              // Expose via a scoped variable for JSX below
              // @ts-ignore - used in JSX
              (globalThis as any).__selectedProducts = selectedProducts;
              return null;
            })()}
            <CartPresenter
              cartItems={cartItems}
              cartSummary={cartSummary}
              loading={loading}
              error={error}
              allItemsSelected={allItemsSelected}
              onRemoveItem={handleRemoveItem}
              onSelectItem={handleSelectItem}
              onUnselectItem={handleUnselectItem}
              onSelectAll={handleSelectAll}
              onUnselectAll={handleUnselectAll}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
              onClearError={clearErrorFromState}
              onEditItem={handleEditItem}
              note={note}
              onNoteChange={setNote}
            />
            
            {/* Quick View Modal */}
            <ProductQuickViewModal
              isOpen={isQuickViewOpen}
              onClose={() => {
                setIsQuickViewOpen(false);
                setSelectedProductDetailId(null);
                setSelectedItemSize(undefined);
                setSelectedCartItemId(null);
                setSelectedItemQuantity(undefined);
              }}
              productId={selectedProductDetailId}
              currentSize={selectedItemSize}
              isEditMode={true}
              cartItemId={selectedCartItemId ?? undefined}
              currentQuantity={selectedItemQuantity}
              onConfirmEdit={({ cartItemId, productDetailId, sizeName, quantity }) => {
                // Prefer to use cartItemId if provided; otherwise we don't have an id to update
                const idToUse = cartItemId ?? selectedCartItemId;
                if (!idToUse) {
                  console.warn('No cartItemId provided to confirm edit');
                  return;
                }

                // Build payload according to new API contract
                const payload = {
                  cartDetailId: idToUse,
                  newProductDetailId: productDetailId ?? selectedProductDetailId ?? undefined,
                  quantity: quantity ?? 1,
                };

                dispatch(updateCartItemAsync(payload));

                // Close modal after dispatch
                setIsQuickViewOpen(false);
                setSelectedProductDetailId(null);
                setSelectedItemSize(undefined);
              }}
            />

            {/* Order Modal */}
            <OrderModal 
              isOpen={isOrderModalOpen} 
              onClose={handleCloseOrderModal}
              products={(globalThis as any).__selectedProducts}
              note={note}
            />
          </>
        )}
      </CartCallState>
    </div>
  );
};