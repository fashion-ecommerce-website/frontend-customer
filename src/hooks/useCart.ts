import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchCart } from '@/features/cart/redux/cartSaga';
import { selectCartItems, selectCartSummary, selectCartLoading, selectCartError } from '@/features/cart/redux/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartSummary = useAppSelector(selectCartSummary);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);

  // Initialize cart data
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const refreshCart = () => {
    dispatch(fetchCart());
  };

  return {
    cartItems,
    cartSummary,
    loading,
    error,
    refreshCart
  };
};