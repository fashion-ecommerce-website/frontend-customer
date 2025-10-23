import React from 'react';
import { Metadata } from 'next';
import { OrderContainer } from '@/features/order/containers/OrderContainer';

export const metadata: Metadata = {
  title: 'Order Confirmation - Fashion Store',
  description: 'View and manage your order',
};

export default function OrderPage() {
  return <OrderContainer />;
}


