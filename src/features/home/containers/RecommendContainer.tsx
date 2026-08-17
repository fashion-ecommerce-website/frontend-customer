'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { productApi } from '@/services/api/productApi';
import { RecommendPresenter } from '../components/RecommendPresenter';

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

export function RecommendContainer() {
    const router = useRouter();
    const [products, setProducts] = useState<RecommendProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await productApi.getBestSellers();

            if (response.success && response.data) {
                const transformedProducts = response.data.map((item) => ({
                    detailId: item.detailId,
                    productSlug: item.productSlug,
                    productTitle: item.productTitle,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    percentOff: item.percentOff ?? 0,
                    imageUrls: item.imageUrls,
                    colors: item.colors,
                    quantity: item.quantity,
                }));
                setProducts(transformedProducts);
            } else {
                throw new Error(response.message || 'Failed to fetch recommendations');
            }
        } catch (err) {
            console.error('❌ Failed to fetch recommendations:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const handleProductClick = useCallback((detailId: number) => {
        router.push(`/products/${detailId}`);
    }, [router]);

    return (
        <RecommendPresenter
            products={products}
            loading={loading}
            error={error}
            onProductClick={handleProductClick}
        />
    );
}
