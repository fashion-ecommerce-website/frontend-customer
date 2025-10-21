import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface EnumResponseDto {
  orderStatus: Record<string, string>;
  paymentMethod: Record<string, string>;
  paymentStatus: Record<string, string>;
  fulfillmentStatus: Record<string, string>;
  voucherUsageStatus: Record<string, string>;
  audienceType: Record<string, string>;
  voucherType: Record<string, string>;
}

const COMMON_ENDPOINTS = {
  ENUMS: '/common/enums',
} as const;

class CommonApiService {
  async getEnums(): Promise<ApiResponse<EnumResponseDto>> {
    // Public endpoint, skip auth
    return apiClient.get<EnumResponseDto>(COMMON_ENDPOINTS.ENUMS, undefined, true);
  }
}

export const commonApiService = new CommonApiService();


