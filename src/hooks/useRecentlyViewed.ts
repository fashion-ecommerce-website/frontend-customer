import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { selectAccessToken } from '@/features/auth/login/redux/loginSlice';
import { recentlyViewedApiService } from '@/services/api/recentlyViewedApi';

export interface RecentlyViewedItem {
  productTitle: string;
  colorName: string;
  productSlug: string;
  imageUrls: string[];
  colors: string[];
  price: number;
  quantity: number;
  detailId: number;
}

export const useRecentlyViewed = () => {
  const token = useAppSelector(selectAccessToken);
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecently = async () => {
      try {
        const response = await recentlyViewedApiService.getRecentlyViewed();
        if (response.success && response.data) {
          setItems(response.data);
        } else {
          throw new Error(response.message || 'Error fetching recently viewed');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecently();
  }, [token]);

  const clearAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recentlyViewedApiService.clearAll();
      if (res.success) {
        setItems([]);
      } else {
        throw new Error(res.message || 'Error clearing items');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItems = useCallback(async (slugs: string[]) => {
    setLoading(true);
    try {
      const res = await recentlyViewedApiService.deleteItems(slugs);
      if (res.success) {
        setItems(prev => prev.filter(item => !slugs.includes(item.productSlug)));
      } else {
        throw new Error(res.message || 'Error deleting items');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, clearAll, deleteItems };
};
