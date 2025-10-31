/**
 * Product Schema JSON-LD Component
 * 
 * This component generates structured data markup for products following schema.org standards.
 * Benefits:
 * - Rich snippets in Google search results (price, availability, ratings)
 * - Better product visibility in search
 * - Eligibility for Google Shopping
 * - Voice search optimization
 * 
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */

interface ProductSchemaProps {
  product: {
    detailId: number;
    title: string;
    description?: string[];
    price: number;
    finalPrice: number;
    percentOff?: number;
    activeColor: string;
    images: string[];
    mapSizeToQuantity: { [size: string]: number };
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com';
  
  // Calculate availability based on stock
  const totalQuantity = Object.values(product.mapSizeToQuantity || {}).reduce((sum, qty) => sum + qty, 0);
  const availability = totalQuantity > 0 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock';

  // Format description
  const description = product.description && Array.isArray(product.description)
    ? product.description.join(' ')
    : `Mua ${product.title} chính hãng tại FIT Fashion. Miễn phí vận chuyển toàn quốc.`;

  // Get main image
  const mainImage = product.images?.[0] || `${baseUrl}/images/placeholder-product.jpg`;

  // Build schema object following schema.org Product specification
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: description.substring(0, 5000), // Google limit
    image: product.images || [mainImage],
    brand: {
      '@type': 'Brand',
      name: 'FIT Fashion',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.detailId}`,
      priceCurrency: 'VND',
      price: product.finalPrice || product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'FIT Fashion',
      },
      // If there's a discount, show original price
      ...(product.percentOff && product.percentOff > 0 && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: product.price,
          priceCurrency: 'VND',
        },
      }),
    },
    // Additional product details
    color: product.activeColor,
    // Aggregate rating would go here if you have reviews
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.5',
    //   reviewCount: '234',
    // },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
