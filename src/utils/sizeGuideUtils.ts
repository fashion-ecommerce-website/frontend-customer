/**
 * Utility functions for Size Guide
 */

/**
 * Categories that support Size Guide
 */
const SUPPORTED_CATEGORIES = [
  'ao',
  'ao-thun',
  'ao-polo',
  'ao-somi',
  'ao-hoodie',
  'quan',
  'quan-jogger',
  'quan-short',
] as const;

/**
 * Check if a category slug supports Size Guide
 * @param categorySlug - The category slug to check (e.g., "ao-thun", "quan-jogger")
 * @returns true if the category supports Size Guide, false otherwise
 */
export function isSizeGuideSupported(categorySlug: string | undefined | null): boolean {
  if (!categorySlug) {
    console.log('❌ Size Guide: categorySlug is null/undefined');
    return false;
  }

  // Normalize the slug (lowercase, trim)
  const normalizedSlug = categorySlug.toLowerCase().trim();
  
  // Check if the slug matches any supported category
  const isSupported = SUPPORTED_CATEGORIES.some(category => normalizedSlug === category);
  
  console.log('🔍 Size Guide Check:', {
    original: categorySlug,
    normalized: normalizedSlug,
    isSupported,
    supportedCategories: SUPPORTED_CATEGORIES
  });
  
  return isSupported;
}

/**
 * Get the list of supported categories
 * @returns Array of supported category slugs
 */
export function getSupportedCategories(): readonly string[] {
  return SUPPORTED_CATEGORIES;
}

/**
 * Check if a product title/name suggests it belongs to a supported category
 * This is a fallback when category slug is not available
 * @param productTitle - The product title
 * @returns true if the product likely belongs to a supported category
 */
export function isSizeGuideSupportedByTitle(productTitle: string | undefined | null): boolean {
  if (!productTitle) {
    return false;
  }

  const normalizedTitle = productTitle.toLowerCase();

  // Keywords that suggest clothing items that need size guide
  const keywords = [
    'áo',
    'ao',
    'shirt',
    'polo',
    'hoodie',
    'quần',
    'quan',
    'pants',
    'jogger',
    'short',
    'sơ mi',
    'so mi',
    'thun',
  ];

  return keywords.some(keyword => normalizedTitle.includes(keyword));
}
