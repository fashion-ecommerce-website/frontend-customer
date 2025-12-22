/**
 * Size Charts Data for Different Categories
 */

export interface SizeChartMeasurement {
  size: string;
  chest?: [number, number];
  waist?: [number, number];
  hips?: [number, number];
  height?: [number, number];
  shoulder?: [number, number];
  sleeve?: [number, number];
  length?: [number, number];
  inseam?: [number, number];
}

export interface SizeChart {
  title: string;
  description?: string;
  measurements: SizeChartMeasurement[];
  measurementLabels: {
    [key: string]: string;
  };
}

// Áo thun (T-Shirt)
export const aoThunSizeChart: SizeChart = {
  title: 'T-Shirt',
  description: 'Size chart for T-shirts',
  measurements: [
    { size: 'XS', chest: [80, 85], waist: [65, 70], height: [155, 160], length: [65, 67] },
    { size: 'S', chest: [86, 91], waist: [71, 76], height: [160, 165], length: [67, 69] },
    { size: 'M', chest: [92, 97], waist: [77, 82], height: [165, 170], length: [69, 71] },
    { size: 'L', chest: [98, 103], waist: [83, 88], height: [170, 175], length: [71, 73] },
    { size: 'XL', chest: [104, 109], waist: [89, 94], height: [175, 180], length: [73, 75] },
    { size: 'XXL', chest: [110, 115], waist: [95, 100], height: [180, 185], length: [75, 77] },
  ],
  measurementLabels: {
    chest: 'Chest (cm)',
    waist: 'Waist (cm)',
    height: 'Height (cm)',
    length: 'Length (cm)',
  },
};

// Áo Polo
export const aoPoloSizeChart: SizeChart = {
  title: 'Polo Shirt',
  description: 'Size chart for Polo shirts',
  measurements: [
    { size: 'XS', chest: [82, 87], waist: [67, 72], height: [155, 160], length: [66, 68] },
    { size: 'S', chest: [88, 93], waist: [73, 78], height: [160, 165], length: [68, 70] },
    { size: 'M', chest: [94, 99], waist: [79, 84], height: [165, 170], length: [70, 72] },
    { size: 'L', chest: [100, 105], waist: [85, 90], height: [170, 175], length: [72, 74] },
    { size: 'XL', chest: [106, 111], waist: [91, 96], height: [175, 180], length: [74, 76] },
    { size: 'XXL', chest: [112, 117], waist: [97, 102], height: [180, 185], length: [76, 78] },
  ],
  measurementLabels: {
    chest: 'Chest (cm)',
    waist: 'Waist (cm)',
    height: 'Height (cm)',
    length: 'Length (cm)',
  },
};

// Áo Sơ Mi
export const aoSomiSizeChart: SizeChart = {
  title: 'Dress Shirt',
  description: 'Size chart for Dress shirts',
  measurements: [
    { size: 'XS', chest: [84, 89], waist: [68, 73], height: [155, 160], length: [70, 72] },
    { size: 'S', chest: [90, 95], waist: [74, 79], height: [160, 165], length: [72, 74] },
    { size: 'M', chest: [96, 101], waist: [80, 85], height: [165, 170], length: [74, 76] },
    { size: 'L', chest: [102, 107], waist: [86, 91], height: [170, 175], length: [76, 78] },
    { size: 'XL', chest: [108, 113], waist: [92, 97], height: [175, 180], length: [78, 80] },
    { size: 'XXL', chest: [114, 119], waist: [98, 103], height: [180, 185], length: [80, 82] },
  ],
  measurementLabels: {
    chest: 'Chest (cm)',
    waist: 'Waist (cm)',
    height: 'Height (cm)',
    length: 'Length (cm)',
  },
};

// Áo Hoodie
export const aoHoodieSizeChart: SizeChart = {
  title: 'Hoodie',
  description: 'Size chart for Hoodies',
  measurements: [
    { size: 'XS', chest: [88, 93], waist: [70, 75], height: [155, 160], length: [62, 64] },
    { size: 'S', chest: [94, 99], waist: [76, 81], height: [160, 165], length: [64, 66] },
    { size: 'M', chest: [100, 105], waist: [82, 87], height: [165, 170], length: [66, 68] },
    { size: 'L', chest: [106, 111], waist: [88, 93], height: [170, 175], length: [68, 70] },
    { size: 'XL', chest: [112, 117], waist: [94, 99], height: [175, 180], length: [70, 72] },
    { size: 'XXL', chest: [118, 123], waist: [100, 105], height: [180, 185], length: [72, 74] },
  ],
  measurementLabels: {
    chest: 'Chest (cm)',
    waist: 'Waist (cm)',
    height: 'Height (cm)',
    length: 'Length (cm)',
  },
};

// Quần (General Pants)
export const quanSizeChart: SizeChart = {
  title: 'Pants',
  description: 'Size chart for Pants',
  measurements: [
    { size: 'XS', waist: [60, 65], hips: [85, 90], length: [95, 97] },
    { size: 'S', waist: [66, 71], hips: [91, 96], length: [97, 99] },
    { size: 'M', waist: [72, 77], hips: [97, 102], length: [99, 101] },
    { size: 'L', waist: [78, 83], hips: [103, 108], length: [101, 103] },
    { size: 'XL', waist: [84, 89], hips: [109, 114], length: [103, 105] },
    { size: 'XXL', waist: [90, 95], hips: [115, 120], length: [105, 107] },
  ],
  measurementLabels: {
    waist: 'Waist (cm)',
    hips: 'Hips (cm)',
    length: 'Length (cm)',
  },
};

// Quần Jogger
export const quanJoggerSizeChart: SizeChart = {
  title: 'Jogger Pants',
  description: 'Size chart for Jogger pants',
  measurements: [
    { size: 'XS', waist: [62, 67], hips: [87, 92], length: [93, 95] },
    { size: 'S', waist: [68, 73], hips: [93, 98], length: [95, 97] },
    { size: 'M', waist: [74, 79], hips: [99, 104], length: [97, 99] },
    { size: 'L', waist: [80, 85], hips: [105, 110], length: [99, 101] },
    { size: 'XL', waist: [86, 91], hips: [111, 116], length: [101, 103] },
    { size: 'XXL', waist: [92, 97], hips: [117, 122], length: [103, 105] },
  ],
  measurementLabels: {
    waist: 'Waist (cm)',
    hips: 'Hips (cm)',
    length: 'Length (cm)',
  },
};

// Quần Short
export const quanShortSizeChart: SizeChart = {
  title: 'Shorts',
  description: 'Size chart for Shorts',
  measurements: [
    { size: 'XS', waist: [60, 65], hips: [85, 90], length: [40, 42] },
    { size: 'S', waist: [66, 71], hips: [91, 96], length: [42, 44] },
    { size: 'M', waist: [72, 77], hips: [97, 102], length: [44, 46] },
    { size: 'L', waist: [78, 83], hips: [103, 108], length: [46, 48] },
    { size: 'XL', waist: [84, 89], hips: [109, 114], length: [48, 50] },
    { size: 'XXL', waist: [90, 95], hips: [115, 120], length: [50, 52] },
  ],
  measurementLabels: {
    waist: 'Waist (cm)',
    hips: 'Hips (cm)',
    length: 'Length (cm)',
  },
};

// Áo (General - fallback)
export const aoSizeChart: SizeChart = {
  title: 'Tops',
  description: 'General size chart for tops',
  measurements: [
    { size: 'XS', chest: [80, 85], waist: [65, 70], height: [155, 160] },
    { size: 'S', chest: [86, 91], waist: [71, 76], height: [160, 165] },
    { size: 'M', chest: [92, 97], waist: [77, 82], height: [165, 170] },
    { size: 'L', chest: [98, 103], waist: [83, 88], height: [170, 175] },
    { size: 'XL', chest: [104, 109], waist: [89, 94], height: [175, 180] },
    { size: 'XXL', chest: [110, 115], waist: [95, 100], height: [180, 185] },
  ],
  measurementLabels: {
    chest: 'Chest (cm)',
    waist: 'Waist (cm)',
    height: 'Height (cm)',
  },
};

/**
 * Get size chart based on category slug
 */
export function getSizeChartByCategory(categorySlug: string): SizeChart {
  const normalizedSlug = categorySlug.toLowerCase().trim();

  switch (normalizedSlug) {
    case 'ao-thun':
      return aoThunSizeChart;
    case 'ao-polo':
      return aoPoloSizeChart;
    case 'ao-somi':
      return aoSomiSizeChart;
    case 'ao-hoodie':
      return aoHoodieSizeChart;
    case 'quan':
      return quanSizeChart;
    case 'quan-jogger':
      return quanJoggerSizeChart;
    case 'quan-short':
      return quanShortSizeChart;
    case 'ao':
      return aoSizeChart;
    default:
      // Fallback: check if it's tops or bottoms
      if (normalizedSlug.includes('ao')) {
        return aoSizeChart;
      } else if (normalizedSlug.includes('quan')) {
        return quanSizeChart;
      }
      return aoSizeChart; // Default fallback
  }
}

/**
 * Check if category is tops (áo)
 */
export function isTopsCategory(categorySlug: string): boolean {
  const normalizedSlug = categorySlug.toLowerCase().trim();
  return normalizedSlug.includes('ao') || 
         normalizedSlug === 'shirt' || 
         normalizedSlug === 'polo' || 
         normalizedSlug === 'hoodie';
}

/**
 * Check if category is bottoms (quần)
 */
export function isBottomsCategory(categorySlug: string): boolean {
  const normalizedSlug = categorySlug.toLowerCase().trim();
  return normalizedSlug.includes('quan') || 
         normalizedSlug === 'pants' || 
         normalizedSlug === 'jogger' || 
         normalizedSlug === 'short';
}

/**
 * Size chart data maps for size recommendation calculations
 * Format: { size: { measurement: [min, max] } }
 */

// Tops size charts map
export const topsSizeCharts = {
  tops: {
    XS: { chest: [80, 85], waist: [65, 70], height: [155, 160] },
    S: { chest: [86, 91], waist: [71, 76], height: [160, 165] },
    M: { chest: [92, 97], waist: [77, 82], height: [165, 170] },
    L: { chest: [98, 103], waist: [83, 88], height: [170, 175] },
    XL: { chest: [104, 109], waist: [89, 94], height: [175, 180] },
    XXL: { chest: [110, 115], waist: [95, 100], height: [180, 185] }
  }
};

// Bottoms size charts map
export const bottomsSizeCharts = {
  bottoms: {
    XS: { waist: [60, 65], hips: [85, 90] },
    S: { waist: [66, 71], hips: [91, 96] },
    M: { waist: [72, 77], hips: [97, 102] },
    L: { waist: [78, 83], hips: [103, 108] },
    XL: { waist: [84, 89], hips: [109, 114] },
    XXL: { waist: [90, 95], hips: [115, 120] }
  }
};

/**
 * Get size chart map for size recommendation based on category
 */
export function getSizeChartMapByCategory(categorySlug: string) {
  if (isBottomsCategory(categorySlug)) {
    return bottomsSizeCharts;
  }
  return topsSizeCharts;
}
