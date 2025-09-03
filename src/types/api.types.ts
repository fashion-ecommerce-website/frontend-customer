/**
 * Common API types used across the application
 */

// Generic API Response interface
export interface ApiResponse<T = unknown> {
  data: T | null;
  message?: string;
  success: boolean;
  status?: number;
  errors?: Record<string, string[]>;
}

// Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Common response status
export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading'
}

// Pagination interface
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
