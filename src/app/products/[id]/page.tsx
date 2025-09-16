import { ProductDetailContainer } from '@/features/product-detail';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  return (
    <ProductDetailContainer productId={id} />
  );
}