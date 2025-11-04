import { HomeContainer } from '@/features/home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIT Fashion - Authentic Fashion, Attractive Deals',
  description: 'Discover the latest fashion collection at FIT Fashion. T-shirts, shirts, jeans, dresses and more. Free nationwide shipping. 7-day return policy.',
  keywords: 'fashion, clothing, t-shirts, shirts, jeans, dresses, accessories, shoes',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
  },
  openGraph: {
    type: 'website',
    title: 'FIT Fashion - Authentic Fashion',
    description: 'Discover the latest fashion collection. Free nationwide shipping.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
    siteName: 'FIT Fashion',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT Fashion - Authentic Fashion',
    description: 'Discover the latest fashion collection',
    creator: '@fitfashion',
  },
};

export default function Home() {
  return <HomeContainer />;
}
