'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PaymentApi } from '@/services/api/paymentApi';
import { useLanguage } from '@/hooks/useLanguage';

function CheckoutSuccessContent(): React.ReactElement {
    const { translations } = useLanguage();
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');
    const paymentIdParam = searchParams.get('paymentId');
    const statusParam = (searchParams.get('status') || 'success').toLowerCase();
    const paymentParam = (searchParams.get('payment') || 'paid').toLowerCase();
    const isUnpaid = paymentParam === 'unpaid';
    const isSuccess = statusParam === 'success';
    const orderId = orderIdParam ? parseInt(orderIdParam, 10) : null;
    const paymentId = paymentIdParam ? parseInt(paymentIdParam, 10) : null;

    // Handle pay again functionality (same as in ProfilePresenter)
    const handlePayAgain = async () => {
        if (!paymentId) {
            console.log('Payment ID is not available for this order');
            return;
        }
        
        try {
            const response = await PaymentApi.createCheckout({
                paymentId,
                successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}${orderId ? `&orderId=${orderId}` : ''}`,
                cancelUrl: `${window.location.origin}/checkout/success?status=canceled&paymentId=${paymentId}${orderId ? `&orderId=${orderId}` : ''}`
            });
            
            if (response.success && response.data?.checkoutUrl) {
                // Redirect to Stripe checkout
                window.location.href = response.data.checkoutUrl;
            } else {
                console.error('Failed to create checkout session:', response.message);
                alert('Failed to create checkout session. Please try again.');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('An error occurred. Please try again.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Main Card */}
                <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
                    
                    <div className="p-8">
                        {/* Icon Section */}
                        <div className="text-center mb-6">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                                isSuccess ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                {isSuccess ? (
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-3">
                                {isSuccess ? (isUnpaid ? translations.orderModal.orderSuccessTitle : translations.orderModal.paymentSuccessTitle) : translations.orderModal.paymentCanceledTitle}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {isSuccess
                                    ? (isUnpaid 
                                        ? translations.orderModal.orderSuccessDesc 
                                        : translations.orderModal.paymentSuccessDesc)
                                    : translations.orderModal.paymentCanceledDesc}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {isSuccess ? (
                                <Link 
                                    href={orderId ? `/profile?section=order-info&orderId=${orderId}` : '/profile?section=order-info'} 
                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {translations.orderModal.viewOrder}
                                </Link>
                            ) : (
                                paymentId && (
                                    <button 
                                        onClick={handlePayAgain}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        {translations.orderModal.payAgain}
                                    </button>
                                )
                            )}
                            
                            <Link 
                                href="/products" 
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {translations.orderModal.continueShopping}
                            </Link>
                        </div>

                        {/* Additional Info */}
                        {isSuccess && !isUnpaid && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    {translations.orderModal.emailConfirmation}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback(): React.ReactElement {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Loading...</div>;
}

export default function CheckoutSuccessPage(): React.ReactElement {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}


