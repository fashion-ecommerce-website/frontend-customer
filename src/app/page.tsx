import { HomeContainer } from '@/features/home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIT Fashion - Thời trang chính hãng, Ưu đãi hấp dẫn',
  description: 'Khám phá bộ sưu tập thời trang mới nhất tại FIT Fashion. Áo thun, áo sơ mi, quần jean, váy đầm và nhiều hơn nữa. Miễn phí vận chuyển toàn quốc. Đổi trả trong 7 ngày.',
  keywords: 'thời trang, quần áo, áo thun, áo sơ mi, quần jean, váy đầm, phụ kiện, giày dép',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
  },
  openGraph: {
    type: 'website',
    title: 'FIT Fashion - Thời trang chính hãng',
    description: 'Khám phá bộ sưu tập thời trang mới nhất. Miễn phí vận chuyển toàn quốc.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
    siteName: 'FIT Fashion',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT Fashion - Thời trang chính hãng',
    description: 'Khám phá bộ sưu tập thời trang mới nhất',
    creator: '@fitfashion',
  },
};

export default function Home() {
  return <HomeContainer />;
}
