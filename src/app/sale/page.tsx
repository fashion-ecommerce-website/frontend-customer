import { SaleContainer } from '@/features/sale';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sale - FIT Fashion | Giảm giá đặc biệt',
  description:
    'Khám phá các sản phẩm thời trang đang được giảm giá hấp dẫn tại FIT Fashion.',
  keywords: 'sale, giảm giá, khuyến mãi, thời trang',
};

export default function SalePage() {
  return <SaleContainer />;
}
