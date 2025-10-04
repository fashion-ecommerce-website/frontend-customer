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
    // categories are public; skip auth checks so unauthenticated users can fetch them
    return apiClient.get<Category[]>('/categories/tree', undefined, true);
  },
};
