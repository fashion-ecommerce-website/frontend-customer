'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCarousel } from '@/components/ProductCarousel';
import { productApi } from '@/services/api/productApi';
import { useLanguage } from '@/hooks/useLanguage';

interface SimilarProductsProps {
    categorySlug?: string;
    currentProductId: number;
    currentPrice: number;
}

interface Product {
    detailId: number;
    productSlug: string;
    productTitle: string;
    price: number;
    finalPrice: number;
    percentOff: number;
    imageUrls: string[];
    colors: string[];
    quantity: number;
}

export function SimilarProducts({ categorySlug, currentProductId, currentPrice }: SimilarProductsProps) {
    const router = useRouter();
    const { translations } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            // If no categorySlug is provided, we can't filter by category.
            const searchCategory = categorySlug || 'ao-thun';

            // Determine price range filter
            let priceFilter = '';
            if (currentPrice < 1000000) {
                priceFilter = '<1m';
            } else if (currentPrice >= 1000000 && currentPrice < 2000000) {
                priceFilter = '1-2m';
            } else if (currentPrice >= 2000000 && currentPrice < 3000000) {
                priceFilter = '2-3m';
            } else if (currentPrice >= 4000000) {
                priceFilter = '>4m';
            }

            try {
                setLoading(true);
                const response = await productApi.getProducts({
                    category: searchCategory,
                    price: priceFilter || undefined,
                    pageSize: 13, // Fetch 13 to ensure we have 12 after filtering current product
                    page: 1,
                });

                if (response.success && response.data?.items) {
                    // Filter out the current product
                    const filteredItems = response.data.items.filter(
                        (item) => item.detailId !== currentProductId
                    );

                    // Limit to 12 items
                    const limitedItems = filteredItems.slice(0, 12);

                    const transformedProducts = limitedItems.map((item) => ({
                        detailId: item.detailId,
                        productSlug: item.productSlug,
                        productTitle: item.productTitle,
                        price: item.price,
                        finalPrice: item.finalPrice,
                        percentOff: item.percentOff || 0,
                        imageUrls: item.imageUrls,
                        colors: item.colors,
                        quantity: item.quantity,
                    }));
                    setProducts(transformedProducts);
                }
            } catch (error) {
                console.error('❌ Failed to fetch similar products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [categorySlug, currentProductId, currentPrice]);

    const handleProductClick = (detailId: number) => {
        router.push(`/products/${detailId}`);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 py-8 md:py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-8xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                        {translations.product.similarProducts}
                    </h2>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white">
            <ProductCarousel
                products={products}
                title={translations.product.similarProducts}
                onProductClick={handleProductClick}
            />
        </section>
    );
}
