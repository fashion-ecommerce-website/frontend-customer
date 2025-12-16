import { Metadata } from 'next';
import { Suspense } from 'react';
import { CartContainer } from '@/features/cart/containers'

export const metadata: Metadata = {
  title: 'Shopping Cart - Fashion Store',
  description: 'View and manage products in your shopping cart',
};

function CartLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartLoading />}>
      <CartContainer />
    </Suspense>
  );
}