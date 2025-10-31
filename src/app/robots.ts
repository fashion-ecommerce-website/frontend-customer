import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for the website
 * This will be available at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',           // Don't index cart pages
          '/checkout',       // Don't index checkout pages
          '/checkout/*',     // Don't index checkout success pages
          '/api/*',          // Don't crawl API endpoints
          '/profile',        // Don't index user profile pages
          '/profile/*',      // Don't index user order pages
          '/auth/*',         // Don't index auth pages
          '/*?utm_*',        // Don't index URLs with tracking params
          '/*?fbclid=*',     // Don't index Facebook tracking
          '/*?gclid=*',      // Don't index Google Ads tracking
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/checkout/*',
          '/api/*',
          '/profile',
          '/profile/*',
          '/auth/*',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/profile',
          '/auth/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
