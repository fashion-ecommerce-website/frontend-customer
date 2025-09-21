'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { fetchCart } from '@/features/cart/redux/cartSaga';
import { selectCartItems, clearCart } from '@/features/cart/redux/cartSlice';

interface CartInitializerProps {
  children: React.ReactNode;
}

export const CartInitializer: React.FC<CartInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const hasFetchedRef = useRef(false);
  const prevAuthenticatedRef = useRef<boolean | null>(null);

  useEffect(() => {
    // Handle authentication state changes
    if (prevAuthenticatedRef.current !== null) {
      // If user was authenticated before but now is not (logout)
      if (prevAuthenticatedRef.current === true && !isAuthenticated) {
        // Clear cart data when user logs out
        dispatch(clearCart());
        hasFetchedRef.current = false;
      }
      
      // If user was not authenticated before but now is (login)
      if (prevAuthenticatedRef.current === false && isAuthenticated) {
        // Reset fetch flag so cart can be fetched for new user
        hasFetchedRef.current = false;
      }
    }
    
    // Only fetch cart if:
    // 1. User is authenticated
    // 2. Haven't fetched before
    // 3. No cart items exist
    if (isAuthenticated && !hasFetchedRef.current && cartItems.length === 0) {
      dispatch(fetchCart());
      hasFetchedRef.current = true;
    }
    
    // Update previous authentication state
    prevAuthenticatedRef.current = isAuthenticated;
  }, [dispatch, isAuthenticated, cartItems.length]);

  return <>{children}</>;
};