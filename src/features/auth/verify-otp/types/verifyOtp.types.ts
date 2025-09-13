import { ApiResponse } from '@/types/api.types';

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export type VerifyOtpResponse = ApiResponse<null>;
