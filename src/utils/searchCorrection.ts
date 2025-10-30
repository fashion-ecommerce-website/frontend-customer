/**
 * Search keyword corrections and suggestions
 */

// Common typos and their corrections for Vietnamese fashion keywords
export const TYPO_CORRECTIONS: Record<string, string> = {
  // Áo variations
  'a thun': 'áo thun',
  'ao thu': 'áo thun', 
  'ao thun': 'áo thun',
  'a polo': 'áo polo',
  'ao polo': 'áo polo',
  'a khoac': 'áo khoác',
  'ao khoac': 'áo khoác',
  'a so mi': 'áo sơ mi',
  'ao so mi': 'áo sơ mi',
  
  // Quần variations
  'quan jean': 'quần jean',
  'quan jeans': 'quần jean',
  'quan short': 'quần short',
  'quan dai': 'quần dài',
  
  // Váy variations
  'vay': 'váy',
  'vay ngan': 'váy ngắn',
  
  // Đầm variations
  'dam': 'đầm',
  'dam dai': 'đầm dài',
};

// Popular search keywords
export const POPULAR_KEYWORDS = [
  'áo thun',
  'áo polo', 
  'áo khoác',
  'áo sơ mi',
  'quần jean',
  'quần short',
  'váy',
  'đầm',
];

/**
 * Find suggested correction for a search query
 * Returns null if no suggestion found
 */
export const findSuggestion = (query: string): string | null => {
  if (!query) return null;
  
  const normalized = query.trim().toLowerCase();
  
  // Direct match in typo corrections
  if (TYPO_CORRECTIONS[normalized]) {
    return TYPO_CORRECTIONS[normalized];
  }
  
  // Check if query is substring of any popular keyword
  for (const keyword of POPULAR_KEYWORDS) {
    const keywordLower = keyword.toLowerCase();
    
    // If query is contained in keyword (e.g., "a thu" in "áo thun")
    if (keywordLower.includes(normalized) && normalized.length >= 3) {
      return keyword;
    }
    
    // If keyword is contained in query (e.g., "áo thun đen" contains "áo thun")
    if (normalized.includes(keywordLower)) {
      return keyword;
    }
  }
  
  return null;
};

/**
 * Calculate simple similarity score between two strings
 * Returns value between 0 and 1
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // Simple Levenshtein-like check
  let matches = 0;
  const minLength = Math.min(s1.length, s2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  
  return matches / Math.max(s1.length, s2.length);
};

/**
 * Get fuzzy match suggestions based on similarity
 * Returns array of suggested keywords sorted by relevance
 */
export const getFuzzySuggestions = (query: string, threshold: number = 0.5): string[] => {
  if (!query || query.length < 2) return [];
  
  const suggestions = POPULAR_KEYWORDS
    .map(keyword => ({
      keyword,
      score: calculateSimilarity(query, keyword)
    }))
    .filter(item => item.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(item => item.keyword);
  
  return suggestions.slice(0, 3); // Return top 3 matches
};
