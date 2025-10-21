'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/features/order/types';
import OrderDetailPresenter from '@/features/profile/components/OrderDetailPresenter';
import OrderApi from '@/services/api/orderApi';
import { productApi } from '@/services/api/productApi';

// Fetch real order detail via API
export const OrderDetailContainer: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imagesByDetailId, setImagesByDetailId] = React.useState<Record<number, string>>({});

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
          const details = res.data.orderDetails || [];
          if (details.length > 0) {
            const uniqueDetailIds = Array.from(new Set(details.map(d => d.productDetailId)));
            Promise.all(uniqueDetailIds.map(detailId => 
              productApi.getProductById(String(detailId))
                .then(r => ({ id: detailId, img: r.success ? (r.data?.images?.[0] || '') : '' }))
                .catch(() => ({ id: detailId, img: '' }))
            ))
            .then(results => {
              if (!isMounted) return;
              const map: Record<number, string> = {};
              results.forEach(({ id, img }) => { if (img) map[id] = img; });
              setImagesByDetailId(map);
            });
          }
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

  return <OrderDetailPresenter order={order} imagesByDetailId={imagesByDetailId} />;
};

export default OrderDetailContainer;


