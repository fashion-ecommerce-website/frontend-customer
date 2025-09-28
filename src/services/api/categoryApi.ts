import { apiClient } from './baseApi';

export type Category = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  children: Category[] | null;
};

export const categoryApi = {
  getTree: async () => {
    // Uses BaseApi which prepends getApiUrl() automatically
    return apiClient.get<Category[]>('/categories/tree');
  },
};
