import { MetadataRoute } from 'next';
import { getApiUrl } from '@/config/environment';

// Base URL của website (production)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com';

/**
 * Interface cho product item từ API
 */
interface ProductItem {
  detailId: number;
  productSlug: string;
  productTitle: string;
  updatedAt?: string;
}

/**
 * Interface cho paginated response
 */
interface PaginatedProductsResponse {
  items: ProductItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Fetch all products from API (multiple pages if needed)
 */
async function getAllProducts(): Promise<ProductItem[]> {
  const apiUrl = getApiUrl();
  const allProducts: ProductItem[] = [];
  let currentPage = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetch(
        `${apiUrl}/products?page=${currentPage}&pageSize=100`,
        {
          next: { revalidate: 86400 } // Revalidate every 24 hours
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch products page ${currentPage}`);
        break;
      }

      const data: PaginatedProductsResponse = await response.json();
      
      if (data.items && data.items.length > 0) {
        allProducts.push(...data.items);
      }

      hasMore = data.hasNext;
      currentPage++;

      // Safety limit: max 100 pages (10,000 products)
      if (currentPage >= 100) {
        console.warn('Reached maximum page limit for sitemap');
        break;
      }
    }

    console.log(`Fetched ${allProducts.length} products for sitemap`);
    return allProducts;
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

/**
 * Generate sitemap for the website
 * This will be available at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.detailId}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Combine all pages
  return [...staticPages, ...productPages];
}
