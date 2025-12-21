import { useState, useEffect, useCallback } from 'react';
import { colorApiService, ColorResponse } from '@/services/api/colorApi';

// Fallback colors khi không có hex từ API
const FALLBACK_COLORS: Record<string, string> = {
  white: '#f1f0eb',
  black: '#000000',
  red: '#6d2028',
  blue: '#acbdcd',
  'dark blue': '#202846',
  green: '#2c5449',
  yellow: '#dcbe9a',
  pink: '#ddb3bd',
  purple: '#47458e',
  orange: '#f97316',
  gray: '#a7a9a8',
  brown: '#61493f',
  beige: '#ebe7dc',
  mint: '#60a1a7',
};

// Cache colors globally để tránh gọi API nhiều lần
let cachedColors: ColorResponse[] | null = null;
let fetchPromise: Promise<ColorResponse[]> | null = null;

export function useColorMap() {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      // Nếu đã có cache, sử dụng luôn
      if (cachedColors) {
        const map = buildColorMap(cachedColors);
        setColorMap(map);
        setLoading(false);
        return;
      }

      // Nếu đang fetch, đợi promise hiện tại
      if (fetchPromise) {
        const colors = await fetchPromise;
        const map = buildColorMap(colors);
        setColorMap(map);
        setLoading(false);
        return;
      }

      // Fetch mới
      fetchPromise = colorApiService.getActiveColors()
        .then(res => {
          if (res.success && res.data) {
            cachedColors = res.data;
            return res.data;
          }
          return [];
        })
        .catch(() => [])
        .finally(() => {
          fetchPromise = null;
        });

      const colors = await fetchPromise;
      const map = buildColorMap(colors);
      setColorMap(map);
      setLoading(false);
    };

    fetchColors();
  }, []);

  const getColorHex = useCallback((colorName: string): string => {
    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || FALLBACK_COLORS[normalizedName] || normalizedName;
  }, [colorMap]);

  return { colorMap, getColorHex, loading };
}

function buildColorMap(colors: ColorResponse[]): Record<string, string> {
  const map: Record<string, string> = {};
  colors.forEach(color => {
    if (color.hex) {
      map[color.name.toLowerCase().trim()] = color.hex;
    }
  });
  return map;
}
