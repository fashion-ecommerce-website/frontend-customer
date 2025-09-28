import { useCallback } from 'react';
import { useAppDispatch } from './redux';
import { useToast } from '@/components';
import { addToCartAsync } from '@/features/cart/redux/cartSaga';
import { AddToCartPayload } from '@/types/cart.types';

interface UseCartActionsOptions {
  onSuccess?: (item: any) => void;
  onError?: (error: string) => void;
}

export const useCartActions = (options: UseCartActionsOptions = {}) => {
  const dispatch = useAppDispatch();
  const { showProductToast, showError } = useToast();

  const addToCartWithToast = useCallback(async (
    payload: AddToCartPayload & {
      productImage: string;
      productTitle: string;
      price: number;
    }
  ) => {
    try {
      // Dispatch add to cart action
      dispatch(addToCartAsync(payload));
      
      // Show product toast notification
      showProductToast({
        productImage: payload.productImage,
        productTitle: payload.productTitle,
        productPrice: payload.price,
        quantity: payload.quantity,
        duration: 4000
      });

      options.onSuccess?.(payload);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      showError(errorMessage);
      options.onError?.(errorMessage);
    }
  }, [dispatch, showProductToast, showError, options]);

  return {
    addToCartWithToast
  };
};