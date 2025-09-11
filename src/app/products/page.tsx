import { Metadata } from 'next';
import { FilterProductContainer } from '@/features/filter-product';

export const metadata: Metadata = {
  title: 'Products | Fashion E-commerce',
  description: 'Explore our diverse fashion collection with high-quality products. Filter and search products by color, size, and price.',
  keywords: 'fashion, t-shirts, clothing, accessories, online shopping',
};

export default function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Products
            </h1>
            <p className="text-black">
              Explore our diverse fashion collection
            </p>
          </div>
        </div>
      </div>
      
      <FilterProductContainer />
    </div>
  );
}
