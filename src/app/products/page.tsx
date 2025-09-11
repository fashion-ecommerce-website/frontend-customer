import { Metadata } from 'next';
import { FilterProductContainer } from '@/features/filter-product';

export const metadata: Metadata = {
  title: 'Sản phẩm | Fashion E-commerce',
  description: 'Khám phá bộ sưu tập thời trang đa dạng với các sản phẩm chất lượng cao. Lọc và tìm kiếm sản phẩm theo màu sắc, kích thước, giá cả.',
  keywords: 'thời trang, áo thun, quần áo, phụ kiện, mua sắm online',
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Sản phẩm
            </h1>
            <p className="text-black">
              Khám phá bộ sưu tập thời trang đa dạng của chúng tôi
            </p>
          </div>
        </div>
      </div>
      
      <FilterProductContainer />
    </div>
  );
}
