import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { Order, CreateOrderRequest, PaginatedResponse, OrderQueryParams } from '../../features/order/types';

/**
 * Order API service
 */
export class OrderApi {
  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>('/orders', orderData);
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: number): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  }

  /**
   * Get user's orders with pagination and filters
   */
  static async getUserOrders(params?: OrderQueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.direction) queryParams.append('direction', params.direction);
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    return apiClient.get<PaginatedResponse<Order>>(url);
  }

  /**
   * Update order by ID (PUT /orders/{id})
   */
  static async updateOrder(orderId: number, payload: Partial<{
    status: string;
    paymentStatus: string;
    currency: string;
    subtotalAmount: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    note?: string;
  }>): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${orderId}`, payload as any);
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: number): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`);
  }
}

export default OrderApi;
