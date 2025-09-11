import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm | Fashion E-commerce',
  description: 'Xem thông tin chi tiết sản phẩm thời trang',
};

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          Chi tiết sản phẩm
        </h1>
        <p className="text-black mb-4">
          Slug: {params.slug}
        </p>
        <p className="text-sm text-black">
          Trang này sẽ được phát triển để hiển thị thông tin chi tiết sản phẩm
        </p>
      </div>
    </div>
  );
}
