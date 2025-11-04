import { ProductDetailContainer } from '@/features/product-detail';
import { Metadata } from 'next';
import { getApiUrl } from '@/config/environment';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetch product data for metadata generation
 */
async function getProductData(id: string) {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/products/details/${id}`, {
      next: { revalidate: 3600 } // Revalidate every 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for product detail page
 * This improves SEO by providing unique title, description, and Open Graph tags for each product
 */
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);

  // Fallback metadata if product not found
  if (!product) {
    return {
      title: 'Product Not Found - FIT Fashion',
      description: 'The product you are looking for could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com';
  const productUrl = `${baseUrl}/products/${id}`;
  
  // Format price for display
  const priceFormatted = product.finalPrice?.toLocaleString('vi-VN') || product.price?.toLocaleString('vi-VN') || '0';
  const hasDiscount = product.percentOff && product.percentOff > 0;
  
  // Create title with price
  const title = `${product.title} - ${priceFormatted}₫${hasDiscount ? ` (-${product.percentOff}%)` : ''} | FIT Fashion`;
  
  // Create description from product description array or fallback
  const description = product.description && Array.isArray(product.description) 
    ? product.description.join(' ').substring(0, 160)
    : `Mua ${product.title} chính hãng với giá ${priceFormatted}₫. Miễn phí vận chuyển toàn quốc. Đổi trả trong 7 ngày.`;

  // Get first image or use placeholder
  const imageUrl = product.images?.[0] || `${baseUrl}/images/placeholder-product.jpg`;

  return {
    title,
    description,
    
    // Canonical URL - Critical for SEO
    alternates: {
      canonical: productUrl,
    },

    // Open Graph for social media sharing (Facebook, LinkedIn, etc.)
    openGraph: {
      title: product.title,
      description,
      url: productUrl,
      siteName: 'FIT Fashion',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },

    // Twitter Card for Twitter sharing
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [imageUrl],
      creator: '@fitfashion',
    },

    // Additional metadata
    keywords: `${product.title}, ${product.activeColor}, thời trang, quần áo, FIT Fashion`,
    
    // Product-specific metadata
    other: {
      'product:price:amount': product.finalPrice?.toString() || product.price?.toString() || '0',
      'product:price:currency': 'VND',
      ...(hasDiscount && {
        'product:sale_price:amount': product.finalPrice?.toString() || '0',
      }),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  return (
    <ProductDetailContainer productId={id} />
  );
}