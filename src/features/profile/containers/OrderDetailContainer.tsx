'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/features/order/types';
import OrderDetailPresenter from '@/features/profile/components/OrderDetailPresenter';

// Temporary mock fetcher reusing shapes across the app
const useMockOrder = (id: number): Order | null => {
  const baseNow = Date.now();
  const MOCK: Order[] = [
    {
      id: 1001,
      userId: 1,
      userEmail: 'user@example.com',
      userUsername: 'user',
      status: OrderStatus.UNFULFILLED,
      paymentStatus: PaymentStatus.UNPAID,
      currency: 'VND',
      subtotalAmount: 450000,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: 480000,
      note: '',
      shippingAddress: {
        id: 1,
        fullName: 'Nguyen Van A',
        phone: '0900000000',
        line: '123 Le Loi',
        ward: 'Ben Thanh',
        city: 'Ho Chi Minh',
        countryCode: 'VN',
      },
      createdAt: new Date(baseNow - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date(baseNow - 1000 * 60 * 60 * 6).toISOString(),
      orderDetails: [
        { id: 1, productDetailId: 101, title: 'Áo thun nam cổ tròn', colorLabel: 'Trắng', sizeLabel: 'L', quantity: 1, unitPrice: 250000, totalPrice: 250000, imageUrl: '/images/products/image1.jpg' },
        { id: 2, productDetailId: 102, title: 'Quần jean slim fit', colorLabel: 'Xanh', sizeLabel: '32', quantity: 1, unitPrice: 200000, totalPrice: 200000, imageUrl: '/images/products/image1.jpg' },
      ],
      payments: [
        { id: 1, method: PaymentMethod.CASH_ON_DELIVERY, status: PaymentStatus.UNPAID, amount: 480000, provider: null, transactionNo: null, paidAt: null, createdAt: new Date(baseNow - 1000 * 60 * 60 * 12).toISOString() },
      ],
      shipments: [
        { id: 1, trackingNumber: 'GHN-123456', carrier: 'GHN', status: 'CREATED', shippedAt: null, deliveredAt: null, createdAt: new Date(baseNow - 1000 * 60 * 60 * 11).toISOString() },
      ],
    },
  ];
  return MOCK.find(o => o.id === id) || null;
};

export const OrderDetailContainer: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const order = useMockOrder(id);

  if (!order) {
    return (
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-gray-600">Order not found.</div>
      </div>
    );
  }

  return <OrderDetailPresenter order={order} />;
};

export default OrderDetailContainer;


