import { FilterProductContainer } from '@/features/filter-product';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - FIT Fashion | Authentic Men & Women Fashion',
  description: 'Discover thousands of authentic fashion products at FIT Fashion. T-shirts, shirts, jeans, dresses at the best prices. Free nationwide shipping.',
  keywords: 'fashion products, men clothing, women clothing, t-shirts, shirts, jeans',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'}/products`,
  },
  openGraph: {
    type: 'website',
    title: 'Products - FIT Fashion',
    description: 'Discover thousands of authentic fashion products',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'}/products`,
    siteName: 'FIT Fashion',
    locale: 'en_US',
  },
};

export default function ProductsPage() {
  return (
      <FilterProductContainer />
  );
}
