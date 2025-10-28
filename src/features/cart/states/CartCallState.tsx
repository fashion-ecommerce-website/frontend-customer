'use client';

// Cart Call State Component
// Manages cart state and provides data to children

import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  selectCartItems, 
  selectCartSummary, 
  selectCartLoading, 
  selectCartError,
  selectCartHasInitiallyLoaded,
  clearError 
} from '../redux/cartSlice';
import { fetchCart } from '../redux/cartSaga';
import { CartCallStateProps } from '../types';

export const CartCallState: React.FC<CartCallStateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartSummary = useAppSelector(selectCartSummary);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const hasInitiallyLoaded = useAppSelector(selectCartHasInitiallyLoaded);

  // Don't initialize cart data here since CartInitializer already does it
  // This prevents duplicate API calls

  // Refresh cart callback
  const refreshCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Clear error callback
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <>
      {children({
        cartItems,
        cartSummary,
        loading,
        error,
        hasInitiallyLoaded,
        refreshCart,
        clearError: handleClearError
      })}
    </>
  );
};