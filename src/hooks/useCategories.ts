import { useEffect, useState } from 'react';
import { categoryApi, Category } from '@/services/api/categoryApi';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await categoryApi.getTree();
        if (!mounted) return;
        if (!res.success || !res.data) {
          setCategories([]);
          setError(res.message || 'Failed to load categories');
        } else {
          setCategories((res.data || []).filter((c) => c.isActive));
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load categories');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, loading, error } as const;
}
