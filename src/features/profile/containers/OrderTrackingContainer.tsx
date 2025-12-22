'use client';

import React from 'react';
import { Order } from '@/features/order/types';
import OrderTrackingPresenter from '../components/OrderTrackingPresenter';
import trackingApi, { TrackingEvent } from '@/services/api/trackingApi';
import OrderApi from '@/services/api/orderApi';

type OrderTrackingContainerProps = {
  order: Order | null;
  onBack: () => void;
  onOrderUpdate?: (updatedOrder: Order) => void;
};

export const OrderTrackingContainer: React.FC<OrderTrackingContainerProps> = ({ order, onBack, onOrderUpdate }) => {
  const [events, setEvents] = React.useState<TrackingEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = React.useState<Order | null>(order);

  // Update currentOrder when prop changes
  React.useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // Get the latest shipment
  const latestShipment = React.useMemo(() => {
    if (!currentOrder?.shipments?.length) return null;
    return currentOrder.shipments
      .slice()
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .at(-1) || null;
  }, [currentOrder]);

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

  // Refresh tracking from carrier and update order data
  const handleRefresh = React.useCallback(async () => {
    if (!latestShipment?.id || !currentOrder?.id) return;
    setRefreshing(true);
    try {
      // Refresh tracking from carrier
      await trackingApi.refreshTracking(latestShipment.id);
      
      // Re-fetch order to get updated shipment status
      const orderRes = await OrderApi.getOrderById(currentOrder.id);
      if (orderRes.success && orderRes.data) {
        setCurrentOrder(orderRes.data);
        onOrderUpdate?.(orderRes.data);
      }
      
      // Re-fetch tracking events
      await fetchTracking(latestShipment.id);
    } catch {
      // Ignore refresh errors, just re-fetch tracking
      await fetchTracking(latestShipment.id);
    } finally {
      setRefreshing(false);
    }
  }, [latestShipment?.id, currentOrder?.id, fetchTracking, onOrderUpdate]);

  // Initial fetch - refresh from carrier first to get latest events
  React.useEffect(() => {
    if (!latestShipment?.id) {
      setEvents([]);
      setLoading(false);
      return;
    }
    fetchTracking(latestShipment.id, true); // Refresh first on initial load
  }, [latestShipment?.id, fetchTracking]);

  if (!currentOrder) {
    return (
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto text-gray-600">Order not found.</div>
      </div>
    );
  }

  return (
    <OrderTrackingPresenter 
      order={currentOrder}
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


