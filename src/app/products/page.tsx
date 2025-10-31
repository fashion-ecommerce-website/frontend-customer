import { FilterProductContainer } from '@/features/filter-product';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm - FIT Fashion | Thời trang nam nữ chính hãng',
  description: 'Khám phá hàng ngàn sản phẩm thời trang chính hãng tại FIT Fashion. Áo thun, áo sơ mi, quần jean, váy đầm với giá tốt nhất. Miễn phí vận chuyển toàn quốc.',
  keywords: 'sản phẩm thời trang, quần áo nam, quần áo nữ, áo thun, áo sơ mi, quần jean',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'}/products`,
  },
  openGraph: {
    type: 'website',
    title: 'Sản phẩm - FIT Fashion',
    description: 'Khám phá hàng ngàn sản phẩm thời trang chính hãng',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'}/products`,
    siteName: 'FIT Fashion',
    locale: 'vi_VN',
  },
};

export default function ProductsPage() {
  return (
      <FilterProductContainer />
  );
}
