import type { UserMeasurements, Size } from '../types';

// Size charts với measurements ranges
const sizeCharts = {
  tops: {
    XS: { chest: [80, 85], waist: [65, 70], height: [155, 160] },
    S: { chest: [86, 91], waist: [71, 76], height: [160, 165] },
    M: { chest: [92, 97], waist: [77, 82], height: [165, 170] },
    L: { chest: [98, 103], waist: [83, 88], height: [170, 175] },
    XL: { chest: [104, 109], waist: [89, 94], height: [175, 180] },
    XXL: { chest: [110, 115], waist: [95, 100], height: [180, 185] }
  },
  bottoms: {
    XS: { waist: [60, 65], hips: [85, 90] },
    S: { waist: [66, 71], hips: [91, 96] },
    M: { waist: [72, 77], hips: [97, 102] },
    L: { waist: [78, 83], hips: [103, 108] },
    XL: { waist: [84, 89], hips: [109, 114] },
    XXL: { waist: [90, 95], hips: [115, 120] }
  }
};

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * Tính size recommendation dựa trên measurements thực tế
 */
export function calculateRecommendedSize(
  measurements: UserMeasurements, 
  category: string,
  availableSizes: Size[] = ALL_SIZES
): Size {
  const { chest, waist, hips, height, fitPreference, bellyShape, hipShape, chestShape, hasReturnHistory } = measurements;

  const isBottoms = isBottomsCategory(category);

  // Tìm size phù hợp nhất dựa trên measurements
  let recommendedSize: Size;
  if (isBottoms) {
    recommendedSize = findBestSizeForBottoms(waist, hips, availableSizes);
  } else {
    recommendedSize = findBestSizeForTops(chest, waist, height, availableSizes);
  }

  // Điều chỉnh theo fit preference
  recommendedSize = adjustForFitPreference(recommendedSize, fitPreference, availableSizes);

  // Điều chỉnh theo body shape
  recommendedSize = adjustForBodyShape(recommendedSize, bellyShape, hipShape, chestShape, isBottoms, availableSizes);

  // Điều chỉnh nếu có return history (conservative hơn)
  if (hasReturnHistory) {
    recommendedSize = getLargerSize(recommendedSize) || recommendedSize;
  }

  // Đảm bảo size có sẵn
  if (!availableSizes.includes(recommendedSize)) {
    recommendedSize = findClosestAvailableSize(recommendedSize, availableSizes);
  }

  return recommendedSize;
}

/**
 * Tính size recommendation với alternative
 */
export function calculateRecommendedSizes(
  measurements: UserMeasurements,
  category: string,
  availableSizes: Size[] = ALL_SIZES
): { recommended: Size; alternative: Size | null } {
  const recommendedSize = calculateRecommendedSize(measurements, category, availableSizes);

  // Tìm alternative size
  let alternativeSize: Size | null = null;
  const largerSize = getLargerSize(recommendedSize);
  const smallerSize = getSmallerSize(recommendedSize);
  
  if (largerSize && availableSizes.includes(largerSize)) {
    alternativeSize = largerSize;
  } else if (smallerSize && availableSizes.includes(smallerSize)) {
    alternativeSize = smallerSize;
  }

  return { recommended: recommendedSize, alternative: alternativeSize };
}

function isBottomsCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return lower.includes('pants') ||
    lower.includes('shorts') ||
    lower.includes('skirt') ||
    lower.includes('jeans') ||
    lower.includes('leggings') ||
    lower.includes('trousers');
}

function findBestSizeForTops(chest: number, waist: number, height: number, availableSizes: Size[]): Size {
  let bestSize: Size = 'M';
  let maxScore = -1;

  for (const size of availableSizes) {
    const ranges = sizeCharts.tops[size];
    if (!ranges) continue;

    let score = 0;
    // Chest quan trọng nhất (weight: 3)
    if (chest >= ranges.chest[0] && chest <= ranges.chest[1]) score += 3;
    else if (chest >= ranges.chest[0] - 2 && chest <= ranges.chest[1] + 2) score += 1;

    // Waist (weight: 2)
    if (waist >= ranges.waist[0] && waist <= ranges.waist[1]) score += 2;
    else if (waist >= ranges.waist[0] - 2 && waist <= ranges.waist[1] + 2) score += 1;

    // Height (weight: 1)
    if (height >= ranges.height[0] && height <= ranges.height[1]) score += 1;

    if (score > maxScore) {
      maxScore = score;
      bestSize = size;
    }
  }
  return bestSize;
}

function findBestSizeForBottoms(waist: number, hips: number, availableSizes: Size[]): Size {
  let bestSize: Size = 'M';
  let maxScore = -1;

  for (const size of availableSizes) {
    const ranges = sizeCharts.bottoms[size];
    if (!ranges) continue;

    let score = 0;
    // Waist quan trọng nhất (weight: 3)
    if (waist >= ranges.waist[0] && waist <= ranges.waist[1]) score += 3;
    else if (waist >= ranges.waist[0] - 2 && waist <= ranges.waist[1] + 2) score += 1;

    // Hips cũng quan trọng (weight: 3)
    if (hips >= ranges.hips[0] && hips <= ranges.hips[1]) score += 3;
    else if (hips >= ranges.hips[0] - 2 && hips <= ranges.hips[1] + 2) score += 1;

    if (score > maxScore) {
      maxScore = score;
      bestSize = size;
    }
  }
  return bestSize;
}

function adjustForFitPreference(size: Size, fitPreference: string | undefined, availableSizes: Size[]): Size {
  let adjustedSize = size;
  if (fitPreference === 'TIGHT') {
    adjustedSize = getSmallerSize(size) || size;
  } else if (fitPreference === 'LOOSE') {
    adjustedSize = getLargerSize(size) || size;
  }
  
  if (!availableSizes.includes(adjustedSize)) {
    adjustedSize = size;
  }
  return adjustedSize;
}

function adjustForBodyShape(
  size: Size, 
  bellyShape: string | undefined, 
  hipShape: string | undefined, 
  chestShape: string | undefined,
  isBottoms: boolean, 
  availableSizes: Size[]
): Size {
  let adjustedSize = size;

  if (isBottoms) {
    // Bottoms: điều chỉnh theo belly và hip shape
    if (bellyShape === 'ROUND') {
      adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
    }
    if (hipShape === 'WIDE') {
      adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
    }
  } else {
    // Tops: điều chỉnh theo belly và chest shape
    if (bellyShape === 'ROUND') {
      adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
    }
    if (chestShape === 'BROAD') {
      adjustedSize = getLargerSize(adjustedSize) || adjustedSize;
    }
  }

  if (!availableSizes.includes(adjustedSize)) {
    adjustedSize = size;
  }
  return adjustedSize;
}

function findClosestAvailableSize(targetSize: Size, availableSizes: Size[]): Size {
  const targetIndex = ALL_SIZES.indexOf(targetSize);
  let closestSize = availableSizes[0];
  let minDistance = Math.abs(ALL_SIZES.indexOf(closestSize) - targetIndex);

  for (const size of availableSizes) {
    const distance = Math.abs(ALL_SIZES.indexOf(size) - targetIndex);
    if (distance < minDistance) {
      minDistance = distance;
      closestSize = size;
    }
  }
  return closestSize;
}

export function getSmallerSize(size: Size): Size | null {
  const index = ALL_SIZES.indexOf(size);
  return index > 0 ? ALL_SIZES[index - 1] : null;
}

export function getLargerSize(size: Size): Size | null {
  const index = ALL_SIZES.indexOf(size);
  return index < ALL_SIZES.length - 1 ? ALL_SIZES[index + 1] : null;
}

export function generateReasoning(measurements: UserMeasurements, recommendedSize: Size, category: string): string {
  const { fitPreference, gender } = measurements;
  
  let reasoning = `Based on your ${gender.toLowerCase()} body measurements, `;
  
  if (fitPreference === 'TIGHT') {
    reasoning += 'and your preference for tight/fitted clothing, ';
  } else if (fitPreference === 'LOOSE') {
    reasoning += 'and your preference for loose/comfortable clothing, ';
  } else {
    reasoning += 'and your preference for regular fit, ';
  }
  
  reasoning += `we recommend size ${recommendedSize} for this ${category.toLowerCase()}.`;
  
  return reasoning;
}
