import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

// Refund status from backend
export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Refund response from backend
export interface RefundResponse {
  id: number;
  orderId: number;
  userId: number;
  userEmail: string;
  status: RefundStatus;
  reason: string;
  refundAmount: number;
  adminNote: string | null;
  processedBy: number | null;
  processedAt: string | null;
  stripeRefundId: string | null;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[] | null; // List of image URLs from Cloudinary
}

// Create refund request data
export interface CreateRefundData {
  orderId: number;
  reason: string;
  refundAmount: number;
  imageUrls?: string[]; // Optional list of image URLs from Cloudinary
}

// Paginated response
export interface PaginatedRefundResponse {
  content: RefundResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Query params for fetching refunds
export interface RefundQueryParams {
  page?: number;
  size?: number;
  status?: RefundStatus;
}

export class RefundApi {
  /**
   * Create a new refund request
   * POST /api/refunds
   */
  static async createRefund(
    data: CreateRefundData
  ): Promise<ApiResponse<RefundResponse>> {
    return apiClient.post<RefundResponse>('/refunds', {
      orderId: data.orderId,
      reason: data.reason,
      refundAmount: data.refundAmount,
      imageUrls: data.imageUrls,
    });
  }

  /**
   * Get current user's refund requests
   * GET /api/refunds/current-user?page=0&size=10&status=PENDING
   */
  static async getCurrentUserRefunds(
    params?: RefundQueryParams
  ): Promise<ApiResponse<PaginatedRefundResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined)
      queryParams.append('page', params.page.toString());
    if (params?.size !== undefined)
      queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/refunds/current-user?${queryString}`
      : '/refunds/current-user';

    return apiClient.get<PaginatedRefundResponse>(url);
  }

  /**
   * Get refund detail by ID
   * GET /api/refunds/{id}
   */
  static async getRefundById(id: number): Promise<ApiResponse<RefundResponse>> {
    return apiClient.get<RefundResponse>(`/refunds/${id}`);
  }
}

export default RefundApi;
