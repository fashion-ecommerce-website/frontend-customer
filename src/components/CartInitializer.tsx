"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useAuth } from "@/hooks/useAuth";
import { fetchCart } from "@/features/cart/redux/cartSaga";
import {
  selectCartItems,
  clearCart,
  markAsInitiallyLoaded,
  selectCartHasInitiallyLoaded,
} from "@/features/cart/redux/cartSlice";

interface CartInitializerProps {
  children: React.ReactNode;
}

export const CartInitializer: React.FC<CartInitializerProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const hasInitiallyLoaded = useAppSelector(selectCartHasInitiallyLoaded);
  const hasFetchedRef = useRef(false);
  const prevAuthenticatedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevAuthenticatedRef.current !== null) {
      if (prevAuthenticatedRef.current === true && !isAuthenticated) {
        dispatch(clearCart());
        hasFetchedRef.current = false;
      }

      if (prevAuthenticatedRef.current === false && isAuthenticated) {
        hasFetchedRef.current = false;
      }
    }

    if (isAuthenticated && !hasFetchedRef.current && cartItems.length === 0) {
      // Authenticated user: fetch cart from API
      dispatch(fetchCart());
      hasFetchedRef.current = true;
    } else if (!isAuthenticated && !hasInitiallyLoaded) {
      // Guest user: mark cart as initially loaded (empty cart)
      dispatch(markAsInitiallyLoaded());
    }

    prevAuthenticatedRef.current = isAuthenticated;
  }, [dispatch, isAuthenticated, cartItems.length, hasInitiallyLoaded]);

  return <>{children}</>;
};
