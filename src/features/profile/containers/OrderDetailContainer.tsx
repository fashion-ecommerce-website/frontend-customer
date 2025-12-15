'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/features/order/types';
import OrderDetailPresenter from '@/features/profile/components/OrderDetailPresenter';
import OrderApi from '@/services/api/orderApi';
import { RefundModal } from '@/components/modals/RefundModal';
import { RefundApi } from '@/services/api/refundApi';

// Fetch real order detail via API
export const OrderDetailContainer: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  React.useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    OrderApi.getOrderById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          setError(res.message || 'Failed to load order');
        }
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load order');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-gray-600">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-gray-600">{error || 'Order not found.'}</div>
      </div>
    );
  }

  const handleRefundClick = () => {
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async (orderId: number, reason: string, refundAmount: number) => {
    setRefundLoading(true);
    try {
      const response = await RefundApi.createRefund({
        orderId,
        reason,
        refundAmount,
      });
      
      if (response.success) {
        setIsRefundModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to submit refund request');
      }
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <>
      <OrderDetailPresenter 
        order={order} 
        onRefund={handleRefundClick}
      />
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        order={order}
        onConfirm={handleRefundConfirm}
        loading={refundLoading}
      />
    </>
  );
};

export default OrderDetailContainer;


