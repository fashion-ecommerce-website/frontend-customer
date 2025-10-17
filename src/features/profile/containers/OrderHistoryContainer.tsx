'use client';

import React, { useEffect, useState, useCallback } from 'react';
import OrderApi from '@/services/api/orderApi';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/features/order/types';
import { OrderHistoryPresenter } from '../components/OrderHistoryPresenter';

export const OrderHistoryContainer: React.FC<{ onOpenDetail?: (order: Order) => void, onTrack?: (order: Order) => void }> = ({ onOpenDetail, onTrack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const USE_MOCK_DATA = true; // flip to false when API is ready

  // Temporary mock data while API is not available
  const MOCK_ORDERS: Order[] = [
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderDetails: [
        {
          id: 1,
          productDetailId: 101,
          title: 'Áo thun nam cổ tròn',
          colorLabel: 'Trắng',
          sizeLabel: 'L',
          quantity: 1,
          unitPrice: 250000,
          totalPrice: 250000,
          imageUrl: '/images/products/image1.jpg',
        },
        {
          id: 2,
          productDetailId: 102,
          title: 'Quần jean slim fit',
          colorLabel: 'Xanh',
          sizeLabel: '32',
          quantity: 1,
          unitPrice: 200000,
          totalPrice: 200000,
          imageUrl: '/images/products/image1.jpg',
        },
      ],
      payments: [
        {
          id: 1,
          method: PaymentMethod.CASH_ON_DELIVERY,
          status: PaymentStatus.UNPAID,
          amount: 480000,
          provider: null,
          transactionNo: null,
          paidAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
      shipments: [
        {
          id: 1,
          trackingNumber: 'GHN-123456',
          carrier: 'GHN',
          status: 'CREATED',
          shippedAt: null,
          deliveredAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 1002,
      userId: 1,
      userEmail: 'user@example.com',
      userUsername: 'user',
      status: OrderStatus.FULFILLED,
      paymentStatus: PaymentStatus.PAID,
      currency: 'VND',
      subtotalAmount: 750000,
      discountAmount: 50000,
      shippingFee: 30000,
      totalAmount: 730000,
      note: 'Please deliver after 6 PM',
      shippingAddress: {
        id: 2,
        fullName: 'Tran Thi B',
        phone: '0911111111',
        line: '45 Nguyen Trai',
        ward: 'Tan Dinh',
        city: 'Ho Chi Minh',
        countryCode: 'VN',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      orderDetails: [
        {
          id: 3,
          productDetailId: 201,
          title: 'Áo sơ mi tay dài',
          colorLabel: 'Đen',
          sizeLabel: 'M',
          quantity: 1,
          unitPrice: 350000,
          totalPrice: 350000,
          imageUrl: '/images/products/image1.jpg',
        },
        {
          id: 4,
          productDetailId: 202,
          title: 'Quần tây nam',
          colorLabel: 'Xám',
          sizeLabel: '31',
          quantity: 2,
          unitPrice: 200000,
          totalPrice: 400000,
          imageUrl: '/images/products/image1.jpg',
        },
      ],
      payments: [
        {
          id: 2,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.PAID,
          amount: 730000,
          provider: 'Stripe',
          transactionNo: 'STRP-987654',
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      ],
      shipments: [
        {
          id: 2,
          trackingNumber: 'GHTK-654321',
          carrier: 'GHTK',
          status: 'DELIVERED',
          shippedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
          deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
        },
      ],
    },
    {
      id: 1003,
      userId: 1,
      userEmail: 'user@example.com',
      userUsername: 'user',
      status: OrderStatus.UNFULFILLED,
      paymentStatus: PaymentStatus.PAID,
      currency: 'VND',
      subtotalAmount: 1200000,
      discountAmount: 0,
      shippingFee: 35000,
      totalAmount: 1235000,
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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
      orderDetails: [
        {
          id: 5,
          productDetailId: 301,
          title: 'Áo khoác bomber',
          colorLabel: 'Xanh rêu',
          sizeLabel: 'XL',
          quantity: 1,
          unitPrice: 700000,
          totalPrice: 700000,
          imageUrl: '/images/products/image1.jpg',
        },
        {
          id: 6,
          productDetailId: 302,
          title: 'Giày sneaker',
          colorLabel: 'Trắng',
          sizeLabel: '42',
          quantity: 1,
          unitPrice: 500000,
          totalPrice: 500000,
          imageUrl: '/images/products/image1.jpg',
        },
      ],
      payments: [
        {
          id: 3,
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.PAID,
          amount: 1235000,
          provider: 'Stripe',
          transactionNo: 'STRP-123123',
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        },
      ],
      shipments: [
        {
          id: 3,
          trackingNumber: 'VNPOST-111222',
          carrier: 'VNPost',
          status: 'IN_TRANSIT',
          shippedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          deliveredAt: null,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
      ],
    },
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK_DATA) {
        setOrders(MOCK_ORDERS);
        setError(null);
        return;
      }
      const response = await OrderApi.getUserOrders();
      setOrders(response.data || []);
    } catch (e: any) {
      // Use mock data temporarily when API is unavailable
      setOrders(MOCK_ORDERS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="px-4">
      <OrderHistoryPresenter 
        orders={orders}
        loading={loading}
        error={error}
        onReload={fetchOrders}
        onOpenDetail={onOpenDetail}
        onTrack={onTrack}
      />
    </div>
  );
};

export default OrderHistoryContainer;


