import { useEffect, useState } from 'react';
import { commonApiService, EnumResponseDto } from '@/services/api/commonApi';

type EnumsState = {
  data: EnumResponseDto | null;
  loading: boolean;
  error: string | null;
};

let cachedEnums: EnumResponseDto | null = null;
let inflightPromise: Promise<EnumResponseDto | null> | null = null;

export function useEnums() {
  const [state, setState] = useState<EnumsState>({ data: cachedEnums, loading: !cachedEnums, error: null });

  useEffect(() => {
    let mounted = true;

    const fetchEnums = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (!inflightPromise) {
          inflightPromise = commonApiService.getEnums().then(res => {
            inflightPromise = null;
            if (res.success) {
              cachedEnums = res.data as EnumResponseDto;
              return cachedEnums;
            }
            throw new Error(res.message || 'Failed to load enums');
          }).catch(err => {
            inflightPromise = null;
            throw err;
          });
        }

        const data = await inflightPromise;
        if (mounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load enums';
        if (mounted) setState({ data: null, loading: false, error: message });
      }
    };

    if (!cachedEnums) {
      fetchEnums();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}


