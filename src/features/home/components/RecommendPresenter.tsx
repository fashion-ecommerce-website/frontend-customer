'use client';

import React from 'react';
import { ProductCarousel } from '@/components/ProductCarousel';
import { useLanguage } from '@/hooks/useLanguage';

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

interface RecommendPresenterProps {
    products: RecommendProduct[];
    loading: boolean;
    error: string | null;
    onProductClick: (detailId: number) => void;
}

export function RecommendPresenter({ 
    products, 
    loading, 
    error,
    onProductClick 
}: RecommendPresenterProps) {
    const { translations } = useLanguage();
    
    if (loading) {
        return (
            <div className="py-12 sm:py-16 lg:py-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                    {translations.home.recommendForYou}
                </h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return null; // Silent fail for recommendations
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="py-12 sm:py-16 lg:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                {translations.home.recommendForYou}
            </h2>
            <ProductCarousel
                products={products}
                title=""
                onProductClick={onProductClick}
            />
        </div>
    );
}
