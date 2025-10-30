/**
 * Utility functions for managing search history in localStorage
 */

const SEARCH_HISTORY_KEY = 'fashion_search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

/**
 * Get search history from localStorage
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!history) return [];
    
    const parsed = JSON.parse(history);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

/**
 * Add a search query to history
 * @param query - The search query to save
 */
export const addSearchHistory = (query: string): void => {
  if (typeof window === 'undefined') return;
  
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return;
  
  try {
    const history = getSearchHistory();
    
    // Remove duplicate if exists
    const filteredHistory = history.filter(
      item => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
    );
    
    // Add new item at the beginning
    const newHistory: SearchHistoryItem[] = [
      { query: trimmedQuery, timestamp: Date.now() },
      ...filteredHistory
    ];
    
    // Keep only MAX_HISTORY_ITEMS
    const trimmedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

/**
 * Remove a specific item from search history
 * @param query - The query to remove
 */
export const removeSearchHistoryItem = (query: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getSearchHistory();
    const updatedHistory = history.filter(
      item => item.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error removing search history item:', error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

/**
 * Get recent search queries as string array
 * @param limit - Maximum number of items to return
 */
export const getRecentSearches = (limit: number = MAX_HISTORY_ITEMS): string[] => {
  const history = getSearchHistory();
  return history.slice(0, limit).map(item => item.query);
};
