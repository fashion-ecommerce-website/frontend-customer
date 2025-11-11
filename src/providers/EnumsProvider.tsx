/**
 * Enums Provider - Pre-loads enums when app starts
 * Provides enums data via Context API
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { commonApiService, EnumResponseDto } from '@/services/api/commonApi';

type EnumsContextType = {
  data: EnumResponseDto | null;
  loading: boolean;
  error: string | null;
};

const EnumsContext = createContext<EnumsContextType | undefined>(undefined);

export function EnumsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EnumsContextType>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const response = await commonApiService.getEnums();
        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
        } else {
          setState({ 
            data: null, 
            loading: false, 
            error: response.message || 'Failed to load enums' 
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load enums';
        setState({ data: null, loading: false, error: message });
      }
    };

    fetchEnums();
  }, []);

  return (
    <EnumsContext.Provider value={state}>
      {children}
    </EnumsContext.Provider>
  );
}

/**
 * Hook to access pre-loaded enums
 * Enums are guaranteed to be loaded when this hook is called
 * (after initial app load)
 */
export function useEnums() {
  const context = useContext(EnumsContext);
  if (context === undefined) {
    throw new Error('useEnums must be used within EnumsProvider');
  }
  return context;
}
