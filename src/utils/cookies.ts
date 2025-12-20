/**
 * Simple cookie helper for browser usage
 */
export const cookies = {
  set: (name: string, value: string, days = 7) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = location && location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/${secure}; SameSite=Lax`;
  },

  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    // Escape special regex characters in cookie name then build matcher
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = document.cookie.match(new RegExp('(?:^|; )' + escapedName + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  },

  remove: (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; Expires=${new Date(0).toUTCString()}; Path=/; SameSite=Lax`;
  }
};
