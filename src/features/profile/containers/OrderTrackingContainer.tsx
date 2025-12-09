'use client';

import React from 'react';
import { Order } from '@/features/order/types';
import OrderTrackingPresenter from '../components/OrderTrackingPresenter';
import trackingApi, { TrackingEvent } from '@/services/api/trackingApi';

type OrderTrackingContainerProps = {
  order: Order | null;
  onBack: () => void;
};

export const OrderTrackingContainer: React.FC<OrderTrackingContainerProps> = ({ order, onBack }) => {
  const [events, setEvents] = React.useState<TrackingEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  // Get the latest shipment
  const latestShipment = React.useMemo(() => {
    if (!order?.shipments?.length) return null;
    return order.shipments
      .slice()
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .at(-1) || null;
  }, [order]);

  // Fetch tracking events from Backend (with optional refresh first)
  const fetchTracking = React.useCallback(async (shipmentId: number, shouldRefreshFirst: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      // Refresh from carrier first if requested
      if (shouldRefreshFirst) {
        try {
          await trackingApi.refreshTracking(shipmentId);
        } catch {
          // Ignore refresh errors, continue to fetch history
        }
      }
      
      const res = await trackingApi.getTrackingHistory(shipmentId);
      if (res.success && res.data) {
        setEvents(res.data);
      } else {
        setError(res.message || 'Failed to fetch tracking');
        setEvents([]);
      }
    } catch {
      setError('Failed to fetch tracking information');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tracking from carrier
  const handleRefresh = React.useCallback(async () => {
    if (!latestShipment?.id) return;
    setRefreshing(true);
    try {
      await trackingApi.refreshTracking(latestShipment.id);
      // Re-fetch after refresh
      await fetchTracking(latestShipment.id);
    } catch {
      // Ignore refresh errors, just re-fetch
      await fetchTracking(latestShipment.id);
    } finally {
      setRefreshing(false);
    }
  }, [latestShipment?.id, fetchTracking]);

  // Initial fetch - refresh from carrier first to get latest events
  React.useEffect(() => {
    if (!latestShipment?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }
    fetchTracking(latestShipment.id, true); // Refresh first on initial load
  }, [latestShipment?.id, fetchTracking]);

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
      events={events}
      loading={loading}
      error={error}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
};

export default OrderTrackingContainer;


