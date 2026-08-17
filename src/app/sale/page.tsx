import { SaleContainer } from '@/features/sale';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sale - FIT Fashion | Special Offers',
  description:
    'Discover high-end fashion items with special discounts at FIT Fashion.',
  keywords: 'sale, discount, offers, fashion, luxury',
};

export default function SalePage() {
  return <SaleContainer />;
}
