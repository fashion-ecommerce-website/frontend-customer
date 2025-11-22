'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCarousel } from '@/components/ProductCarousel';
import { recommendationApi } from '@/services/api/recommendationApi';

interface RecommendProduct {
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

export function RecommendSection() {
    const router = useRouter();
    const [products, setProducts] = useState<RecommendProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const response = await recommendationApi.getRecommendationsForYou(10);

                if (response.success && response.data) {
                    const transformedProducts = response.data.map((item) => ({
                        detailId: item.detailId,
                        productSlug: item.productSlug,
                        productTitle: item.productTitle,
                        price: item.price,
                        finalPrice: item.finalPrice,
                        percentOff: item.percentOff,
                        imageUrls: item.imageUrls,
                        colors: item.colors,
                        quantity: item.quantity,
                    }));
                    setProducts(transformedProducts);
                }
            } catch (error) {
                console.error('❌ Failed to fetch recommendations:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleProductClick = (detailId: number) => {
        router.push(`/products/${detailId}`);
    };

    if (loading) {
        return (
            <div className="py-12 sm:py-16 lg:py-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                    RECOMMEND FOR YOU
                </h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="py-12 sm:py-16 lg:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                RECOMMEND FOR YOU
            </h2>
            <ProductCarousel
                products={products}
                title=""
                onProductClick={handleProductClick}
            />
        </div>
    );
}
