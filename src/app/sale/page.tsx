import { Metadata } from 'next';
import { SaleProductContainer } from '@/features/sale';

export const metadata: Metadata = {
  title: 'Sale - Sản phẩm giảm giá',
  description: 'Khám phá các sản phẩm đang giảm giá hấp dẫn',
};

export default function SalePage() {
  return <SaleProductContainer />;
}
