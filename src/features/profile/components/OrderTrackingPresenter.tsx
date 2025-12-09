'use client';

import React from 'react';
import { Order, Shipment } from '@/features/order/types';
import { TrackingEvent } from '@/services/api/trackingApi';

type OrderTrackingPresenterProps = {
  order: Order;
  onBack?: () => void;
  events?: TrackingEvent[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
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
  const upperStatus = status?.toUpperCase() || '';
  switch (upperStatus) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'SHIPPED':
    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'PROCESSING':
    case 'CONFIRMED':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'PENDING':
    case 'CREATED':
      return 'bg-gray-100 text-gray-700 border border-gray-200';
    case 'CANCELLED':
    case 'FAILED':
      return 'bg-red-100 text-red-700 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  const upperStatus = status?.toUpperCase() || '';
  switch (upperStatus) {
    case 'PENDING': return 'Order Placed';
    case 'CONFIRMED': return 'Order Confirmed';
    case 'PROCESSING': return 'Processing';
    case 'SHIPPED': return 'In Transit';
    case 'DELIVERED': return 'Delivered';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
};

const getTimelineIcon = (status: string, isLatest: boolean) => {
  const upperStatus = status?.toUpperCase() || '';
  const baseClass = isLatest ? 'w-4 h-4' : 'w-3 h-3';
  
  switch (upperStatus) {
    case 'DELIVERED':
      return (
        <svg className={`${baseClass} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    case 'SHIPPED':
      return (
        <svg className={`${baseClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      );
    case 'CONFIRMED':
      return (
        <svg className={`${baseClass} text-amber-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'PENDING':
      return (
        <svg className={`${baseClass} text-gray-500`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    case 'CANCELLED':
      return (
        <svg className={`${baseClass} text-red-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    default:
      return <span className={`${baseClass} rounded-full bg-current`} />;
  }
};

export const OrderTrackingPresenter: React.FC<OrderTrackingPresenterProps> = ({ 
  order, 
  onBack, 
  events = [], 
  loading, 
  error,
  onRefresh,
  refreshing 
}) => {
  const shipments: Shipment[] = Array.isArray(order.shipments) ? order.shipments : [];
  const latest = shipments
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .at(-1);

  // Sort events by time descending (newest first)
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => 
      new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()
    );
  }, [events]);

  return (
    <div className="px-4 pb-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-black font-bold">Order Tracking</h1>
          <button type="button" onClick={onBack} className="text-sm text-gray-800 hover:text-yellow-800">
            Back to orders history
          </button>
        </div>

        {/* Order Info Card */}
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-gray-700 space-y-1">
              <div className="text-black font-semibold text-base">Order #{order.id}</div>
              <div>
                Tracking Number: {' '}
                <span className="text-black font-medium font-mono">
                  {latest?.trackingNo || 'Not available yet'}
                </span>
              </div>
              <div>
                Carrier: {' '}
                <span className="text-black font-medium">
                  {latest?.carrier || '-'}
                </span>
              </div>
              {latest?.shippedAt && (
                <div>
                  Shipped: {' '}
                  <span className="text-black">{formatDateTime(latest.shippedAt)}</span>
                </div>
              )}
              {latest?.deliveredAt && (
                <div>
                  Delivered: {' '}
                  <span className="text-green-600 font-medium">{formatDateTime(latest.deliveredAt)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(latest?.status || 'PENDING')}`}>
                {getStatusLabel(latest?.status || 'PENDING')}
              </span>
              {onRefresh && latest?.trackingNo && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
                >
                  <svg className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-base text-black font-semibold mb-4 border-b-2 border-black pb-3">
            Tracking Timeline
          </h2>
          
          {loading && (
            <div className="flex items-center gap-2 text-gray-600 text-sm py-4">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading tracking information...
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {!loading && !error && sortedEvents.length > 0 && (
            <ol className="relative border-s-2 border-gray-200 ms-3">
              {sortedEvents.map((event, idx) => {
                const isLatest = idx === 0;
                return (
                  <li key={event.id || `${event.eventTime}-${idx}`} className="mb-8 ms-6">
                    <span className={`absolute -start-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${
                      isLatest ? getStatusBadgeClass(event.status) : 'bg-gray-100'
                    }`}>
                      {getTimelineIcon(event.status, isLatest)}
                    </span>
                    <div className={`${isLatest ? 'bg-gray-50 p-3 rounded-lg border' : ''}`}>
                      <h3 className={`flex items-center gap-2 text-sm font-semibold ${isLatest ? 'text-black' : 'text-gray-700'}`}>
                        {getStatusLabel(event.status)}
                        {isLatest && (
                          <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            Latest
                          </span>
                        )}
                      </h3>
                      <time className="block text-xs text-gray-500 mt-1">
                        {formatDateTime(event.eventTime)}
                      </time>
                      {event.location && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          
          {!loading && !error && sortedEvents.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-sm">No tracking events yet.</p>
              <p className="text-gray-400 text-xs mt-1">
                Tracking information will appear once your order is shipped.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPresenter;


