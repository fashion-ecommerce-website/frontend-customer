import { apiClient } from './baseApi';
import { ApiResponse } from '../../types/api.types';

export interface ColorResponse {
  id: number;
  name: string;
  hex: string | null;
  isActive: boolean;
}

const COLOR_ENDPOINTS = {
  GET_ACTIVE_COLORS: '/colors/active',
} as const;

export class ColorApiService {
  async getActiveColors(): Promise<ApiResponse<ColorResponse[]>> {
    return apiClient.get<ColorResponse[]>(COLOR_ENDPOINTS.GET_ACTIVE_COLORS);
  }
}

export const colorApiService = new ColorApiService();

export const colorApi = {
  getActiveColors: () => colorApiService.getActiveColors(),
};
