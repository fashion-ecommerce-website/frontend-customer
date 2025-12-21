'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { colorApiService, ColorResponse } from '@/services/api/colorApi';

// Fallback colors from database - available immediately on first render
const FALLBACK_COLORS: Record<string, string> = {
  'đen': '#2c2d31',
  'trắng': '#d6d8d3',
  'xanh than': '#14202e',
  'hồng': '#d4a2bb',
  'cam': '#c69338',
  'mint': '#60a1a7',
  'nâu': '#624e4f',
  'vàng': '#dac7a7',
  'xanh lam': '#8ba6c1',
  'xám': '#c6c6c4',
  'xanh lục': '#76715d',
  'tím lơ': '#FF00FF',
  'xanh rêu': '#006600',
  'đỏ': '#EE0000',
};

// Convert fallback colors to ColorOption array for filter sidebar
const FALLBACK_COLOR_OPTIONS: ColorOption[] = Object.entries(FALLBACK_COLORS).map(
  ([name, hex]) => ({ name, hex })
);

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
  // Initialize with fallback colors so they're available immediately
  const [colorMap, setColorMap] = useState<Record<string, string>>(FALLBACK_COLORS);
  // Initialize apiColors with fallback so filter sidebar has data immediately
  const [apiColors, setApiColors] = useState<ColorOption[]>(FALLBACK_COLOR_OPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await colorApiService.getActiveColors();
        
        if (res.success && res.data) {
          const apiMap: Record<string, string> = {};
          const colorList: ColorOption[] = [];
          
          const colors = Array.isArray(res.data) ? res.data : [];
          
          colors.forEach((color: ColorResponse) => {
            if (color.hex) {
              const normalizedName = color.name.toLowerCase().trim();
              apiMap[normalizedName] = color.hex;
              colorList.push({ name: normalizedName, hex: color.hex });
            }
          });
          
          // Merge: API colors override fallback colors
          setColorMap(prev => ({ ...prev, ...apiMap }));
          setApiColors(colorList);
        }
      } catch (error) {
        console.error('Failed to fetch colors:', error);
        // Keep using fallback colors on error
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const getColorHex = useCallback((colorName: string): string => {
    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || '#cccccc';
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
