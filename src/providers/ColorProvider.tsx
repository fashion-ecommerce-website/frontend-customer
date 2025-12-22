'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { colorApiService, ColorResponse } from '@/services/api/colorApi';

export interface ColorOption {
  name: string;
  hex: string;
}

interface ColorContextType {
  colorMap: Record<string, string>;
  apiColors: ColorOption[]; // Only colors from API (for filter)
  getColorHex: (colorName: string) => string;
  loading: boolean;
}

const ColorContext = createContext<ColorContextType | null>(null);

interface ColorProviderProps {
  children: ReactNode;
}

export function ColorProvider({ children }: ColorProviderProps) {
  // Initialize empty - no fallback, only API data
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [apiColors, setApiColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        console.log('🎨 Fetching colors from API...');
        const res = await colorApiService.getActiveColors();
        console.log('🎨 API Response:', res);
        
        if (res.success && res.data) {
          const apiMap: Record<string, string> = {};
          const colorList: ColorOption[] = [];
          
          const colors = Array.isArray(res.data) ? res.data : [];
          console.log('🎨 Colors received:', colors.length, 'items');
          
          colors.forEach((color: ColorResponse) => {
            if (color.hex) {
              const normalizedName = color.name.toLowerCase().trim();
              apiMap[normalizedName] = color.hex;
              colorList.push({ name: normalizedName, hex: color.hex });
              console.log(`🎨 Color: ${normalizedName} -> ${color.hex}`);
            }
          });
          
          setColorMap(apiMap);
          setApiColors(colorList);
          console.log('🎨 ColorMap set:', Object.keys(apiMap).length, 'colors');
        } else {
          console.error('🎨 API failed:', res.message);
        }
      } catch (error) {
        console.error('🎨 Failed to fetch colors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const getColorHex = useCallback((colorName: string): string => {
    const normalizedName = colorName.toLowerCase().trim();
    const hex = colorMap[normalizedName];
    if (!hex) {
      console.warn(`🎨 Color not found: "${colorName}" (normalized: "${normalizedName}")`);
    }
    return hex || '#cccccc';
  }, [colorMap]);

  return (
    <ColorContext.Provider value={{ colorMap, apiColors, getColorHex, loading }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorMap() {
  const context = useContext(ColorContext);
  if (!context) {
    return {
      colorMap: {},
      apiColors: [],
      getColorHex: () => '#cccccc',
      loading: false,
    };
  }
  return context;
}
