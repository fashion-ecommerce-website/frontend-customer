'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { useAppSelector } from '@/hooks/redux';
import { selectIsAuthenticated } from '@/features/auth/login/redux/loginSlice';
import { fetchWishlistRequest, fetchWishlistSuccess } from '@/features/profile/redux/wishlistSlice';

interface WishlistInitializerProps {
  children: React.ReactNode;
}

export const WishlistInitializer: React.FC<WishlistInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasFetchedRef = useRef(false);
  const prevAuthenticatedRef = useRef<boolean | null>(null);

  useEffect(() => {
    // Handle auth changes
    if (prevAuthenticatedRef.current !== null) {
      // On logout: clear wishlist in client store
      if (prevAuthenticatedRef.current === true && !isAuthenticated) {
        dispatch(fetchWishlistSuccess([]));
        hasFetchedRef.current = false;
      }
      // On login: allow refetch for new user
      if (prevAuthenticatedRef.current === false && isAuthenticated) {
        hasFetchedRef.current = false;
      }
    }

    // Fetch once per session when authenticated
    if (isAuthenticated && !hasFetchedRef.current) {
      dispatch(fetchWishlistRequest());
      hasFetchedRef.current = true;
    }

    prevAuthenticatedRef.current = isAuthenticated;
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};


