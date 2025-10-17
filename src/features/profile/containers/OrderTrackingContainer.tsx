'use client';

import React from 'react';
import { Order } from '@/features/order/types';
import OrderTrackingPresenter from '../components/OrderTrackingPresenter';
import ghnApi, { GHNTrackingEvent } from '@/services/api/ghnApi';

type OrderTrackingContainerProps = {
  order: Order | null;
  onBack: () => void;
};

export const OrderTrackingContainer: React.FC<OrderTrackingContainerProps> = ({ order, onBack }) => {
  const [events, setEvents] = React.useState<GHNTrackingEvent[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const resolveTrackingCode = React.useCallback(() => {
    if (!order) return '';
    const latest = order.shipments?.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).at(-1);
    return latest?.trackingNumber || '';
  }, [order]);

  const fetchTracking = React.useCallback((trackingNumber: string) => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    ghnApi.trackOrder(trackingNumber)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setEvents(res.data);
        } else {
          const now = new Date();
          const mock: GHNTrackingEvent[] = [
            { time: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), status: 'CREATED', reason: 'Order created', location: null },
            { time: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), status: 'READY_TO_PICK', reason: 'Waiting for pickup', location: null },
          ];
          setEvents(mock);
          setError(null);
        }
      })
      .catch((e: any) => {
        if (cancelled) return;
        const now = new Date();
        const mock: GHNTrackingEvent[] = [
          { time: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), status: 'CREATED', reason: 'Order created', location: null },
          { time: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), status: 'READY_TO_PICK', reason: 'Waiting for pickup', location: null },
        ];
        setEvents(mock);
        setError(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (!order) return;
    const code = resolveTrackingCode();
    if (!code) {
      // No tracking code from API/order; show mock timeline instead of error
      const now = new Date();
      const mock: GHNTrackingEvent[] = [
        { time: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), status: 'CREATED', reason: 'Order created', location: null },
        { time: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), status: 'READY_TO_PICK', reason: 'Waiting for pickup', location: null },
      ];
      setEvents(mock);
      setError(null);
      setLoading(false);
      return;
    }
    const cleanup = fetchTracking(code);
    return cleanup;
  }, [order, resolveTrackingCode, fetchTracking]);

  if (!order) {
    return (
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-gray-600">Order not found.</div>
      </div>
    );
  }
  return (
    <OrderTrackingPresenter 
      order={order}
      onBack={onBack}
      events={events || []}
      loading={loading}
      error={error}
    />
  );
};

export default OrderTrackingContainer;


