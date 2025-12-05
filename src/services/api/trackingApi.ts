import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Tracking Event from Backend
export interface TrackingEvent {
  id: number;
  status: string;
  location: string | null;
  description: string | null;
  eventTime: string;
}

// Tracking API Service - calls Backend endpoints
export const trackingApi = {
  /**
   * Get tracking history for a shipment
   * GET /api/tracking/shipments/{shipmentId}/events
   */
  getTrackingHistory: async (shipmentId: number): Promise<ApiResponse<TrackingEvent[]>> => {
    return apiClient.get<TrackingEvent[]>(`/tracking/shipments/${shipmentId}/events`);
  },

  /**
   * Refresh tracking from carrier (triggers Backend to fetch latest from GHN/GHTK)
   * POST /api/tracking/shipments/{shipmentId}/refresh
   */
  refreshTracking: async (shipmentId: number): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/tracking/shipments/${shipmentId}/refresh`);
  },
};

export default trackingApi;
