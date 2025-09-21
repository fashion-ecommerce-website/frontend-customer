'use client';

// Cart Container Component
// Business logic container for cart page

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { CartItem } from '@/types/cart.types';
import { removeCartItemAsync } from '../redux/cartSaga';
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

export const CartContainer: React.FC<CartContainerProps> = ({
  className = ''
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allItemsSelected = useAppSelector(selectAllItemsSelected);
  
  // Quick view modal state
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductDetailId, setSelectedProductDetailId] = useState<number | null>(null);

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

  // Handle checkout
  const handleCheckout = useCallback(() => {
    // TODO: Navigate to checkout page
    console.log('Proceeding to checkout...');
    router.push('/checkout');
  }, [router]);

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
            />
            
            {/* Quick View Modal */}
            <ProductQuickViewModal
              isOpen={isQuickViewOpen}
              onClose={() => setIsQuickViewOpen(false)}
              productId={selectedProductDetailId}
            />
          </>
        )}
      </CartCallState>
    </div>
  );
};