'use client';

import React from 'react';
import { Order, Shipment } from '@/features/order/types';
import { GHNTrackingEvent } from '@/services/api/ghnApi';

type OrderTrackingPresenterProps = {
  order: Order;
  onBack?: () => void;
  events?: GHNTrackingEvent[];
  loading?: boolean;
  error?: string | null;
};

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('vi-VN');
  } catch {
    return iso;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'CREATED':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'FAILED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

export const OrderTrackingPresenter: React.FC<OrderTrackingPresenterProps> = ({ order, onBack, events = [], loading, error }) => {
  const shipments: Shipment[] = Array.isArray(order.shipments) ? order.shipments : [];
  const latest = shipments
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .at(-1);

  return (
    <div className="px-4 pb-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-black font-bold">Order Tracking</h1>
          <button type="button" onClick={onBack} className="text-sm text-gray-800 hover:text-yellow-800">Back to orders history</button>
        </div>

        <div className="border rounded p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-sm text-gray-700">
              <div className="text-black font-semibold">Order ID: V{order.id}</div>
              <div>Tracking Number: <span className="text-black font-medium">{latest?.trackingNumber || '-'}</span></div>
              <div>Carrier: <span className="text-black font-medium">{latest?.carrier || '-'}</span></div>
            </div>
            <div>
              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(latest?.status || 'PENDING')}`}>
                {latest?.status || 'PENDING'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base text-black font-semibold mb-4 border-b-3 border-black pb-3">Timeline</h2>
          {loading && (
            <div className="text-gray-600 text-sm">Loading tracking...</div>
          )}
          {error && !loading && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          {!loading && !error && events && events.length > 0 && (
            <ol className="relative border-s border-gray-200">
              {events
                .slice()
                .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                .map((e, idx) => (
                  <li key={`${e.time}-${idx}`} className="mb-10 ms-6">
                    <span className={`absolute -start-3 flex items-center justify-center w-6 h-6 rounded-full ${getStatusBadgeClass(e.status)}`}>•</span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">{e.status} {e.location ? <span className="ms-2 text-xs font-medium text-gray-500">({e.location})</span> : null}</h3>
                    <p className="text-xs text-gray-600">Time: {formatDateTime(e.time)}</p>
                    {e.reason && <p className="text-xs text-gray-600">Note: {e.reason}</p>}
                  </li>
                ))}
            </ol>
          )}
          {!loading && !error && (!events || events.length === 0) && (
            <div className="text-gray-600 text-sm">No tracking events yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPresenter;


