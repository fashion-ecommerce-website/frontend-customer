import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface CreateCheckoutRequest {
	paymentId: number;
	successUrl?: string;
	cancelUrl?: string;
}

export interface CheckoutSessionResponse {
	sessionId: string;
	checkoutUrl: string;
}

export interface RefundRequest {
	paymentId: number;
	amount?: number;
	reason?: 'DUPLICATE' | 'FRAUDULENT' | 'REQUESTED_BY_CUSTOMER';
}

export interface RefundResponse {
	refundId: string;
	status: string;
	amount: number;
	currency: string;
}

export class PaymentApi {
	static async createCheckout(body: CreateCheckoutRequest): Promise<ApiResponse<CheckoutSessionResponse>> {
		return apiClient.post<CheckoutSessionResponse>('/payments/checkout', body);
	}

	static async refund(body: RefundRequest): Promise<ApiResponse<RefundResponse>> {
		return apiClient.post<RefundResponse>('/payments/refund', body);
	}
}

export default PaymentApi;
