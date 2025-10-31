/**
 * Refund Types
 * TypeScript definitions for refund feature
 */

// Refund item interface
export interface RefundItem {
  id: number;
  orderId: number;
  productName: string;
  productImage?: string;
  colorLabel?: string;
  sizeLabel?: string;
  quantity: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  updatedAt?: string;
  note?: string;
}

// Refund query parameters
export interface RefundQueryParams {
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
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
  onFilterChange: (status?: 'pending' | 'approved' | 'rejected' | 'completed') => void;
  onReload: () => void;
}

// Refund container props
export interface RefundContainerProps {
  className?: string;
}
