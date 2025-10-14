import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';
import type { Voucher } from '@/components/modals/VoucherModal';

const VOUCHER_ENDPOINTS = {
  GET_BY_USER: '/vouchers/by-user',
} as const;

export class VoucherApiService {
  async getVouchersByUser(): Promise<ApiResponse<Voucher[]>> {
    // Map server fields to UI Voucher type
    const res = await apiClient.get<any[]>(VOUCHER_ENDPOINTS.GET_BY_USER);
    if (!res.success || !Array.isArray(res.data)) return res as unknown as ApiResponse<Voucher[]>;
    const mapped: Voucher[] = res.data.map((v) => ({
      id: v.id,
      code: v.code,
      label: v.name,
      discountType: (v.type === 'PERCENT' ? 'percent' : 'amount'),
      value: Number(v.value) || 0,
      minSubtotal: typeof v.minOrderAmount === 'number' ? v.minOrderAmount : undefined,
      maxDiscountAmount: typeof v.maxDiscount === 'number' ? v.maxDiscount : undefined,
      expiresAt: v.endAt,
      userUsage: v.usageLimitPerUser ? { used: 0, limit: v.usageLimitPerUser } : undefined,
      globalUsagePercent: v.usageLimitTotal ? 0 : undefined,
      available: typeof v.available === 'boolean' ? v.available : undefined,
      message: v.message,
    }));
    return { success: true, data: mapped, message: res.message };
  }
}

export const voucherApiService = new VoucherApiService();
export const voucherApi = {
  getVouchersByUser: () => voucherApiService.getVouchersByUser(),
};


