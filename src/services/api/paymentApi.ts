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

export class PaymentApi {
	static async createCheckout(body: CreateCheckoutRequest): Promise<ApiResponse<CheckoutSessionResponse>> {
		return apiClient.post<CheckoutSessionResponse>('/payments/checkout', body);
	}
}

export default PaymentApi;
