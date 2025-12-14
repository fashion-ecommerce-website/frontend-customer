/**
 * Refund Types
 * TypeScript definitions for refund feature
 */

// Refund status from backend
export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Refund item interface - matches backend RefundResponse
export interface RefundItem {
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
}

// Refund query parameters
export interface RefundQueryParams {
  status?: RefundStatus;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

// Refund presenter props
export interface RefundPresenterProps {
  refunds: RefundItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onFilterChange: (status?: RefundStatus) => void;
  onReload: () => void;
}

// Refund container props
export interface RefundContainerProps {
  className?: string;
}
