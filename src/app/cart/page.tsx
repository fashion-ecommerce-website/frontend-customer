import { Metadata } from 'next';
import { CartContainer } from '@/features/cart/containers/CartContainer';

export const metadata: Metadata = {
  title: 'Shopping Cart - Fashion Store',
  description: 'View and manage products in your shopping cart',
};

export default function CartPage() {
  return <CartContainer />;
}