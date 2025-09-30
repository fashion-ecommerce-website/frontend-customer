import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import { Order, CreateOrderRequest } from '../../features/order/types';

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
   * Get user's orders
   */
  static async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders');
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
