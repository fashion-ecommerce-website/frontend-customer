'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OrderApi from '@/services/api/orderApi';
import { PaymentStatus } from '@/features/order/types';
import { useAppDispatch } from '@/hooks/redux';

export default function CheckoutSuccessPage(): React.ReactElement {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');
    const statusParam = (searchParams.get('status') || 'success').toLowerCase();
    const paymentParam = (searchParams.get('payment') || 'paid').toLowerCase();
    const isUnpaid = paymentParam === 'unpaid';
    const isSuccess = statusParam === 'success';
    const orderId = orderIdParam ? parseInt(orderIdParam, 10) : null;
    const [orders, setOrders] = React.useState<any[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        const finalizeStripePayment = async () => {
            if (!isSuccess || !orderId || isUnpaid) return; 
            try {
                await OrderApi.updateOrder(orderId, {
                    paymentStatus: 'PAID',
                    status: 'FULFILLED',
                });
            } catch (e) {
                console.error('Failed to update order to PAID:', e);
            }
        };
        finalizeStripePayment();
        return () => {
            isMounted = false;
        };
    }, [dispatch, isSuccess, orderId, isUnpaid]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 py-12 sm:py-16">
            <div className="max-w-3xl w-full bg-white shadow rounded p-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="mt-5 text-2xl font-bold text-zinc-800">{isSuccess ? (isUnpaid ? 'Order successful' : 'Payment successful') : 'Payment canceled'}</h1>
                    <p className="mt-3 text-base text-zinc-600">
                        {isSuccess
                          ? (isUnpaid ? 'Your order has been placed successfully. Please prepare cash on delivery.' : 'Thank you for your purchase! Your payment was successful and your order is being processed.')
                          : 'Your payment was canceled. You can return to checkout to try again.'}
                    </p>

                </div>

                {/* Recent orders removed */}

                <div className="mt-8 flex gap-4 justify-center">
                    {isSuccess ? (
                      <Link href={orderId ? `/profile?section=order-info&orderId=${orderId}` : '/profile?section=order-info'} className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                          {orderId ? `View your order #${orderId}` : 'View your orders'}
                      </Link>
                    ) : (
                      <Link href="/checkout" className="inline-block px-5 py-2.5 bg-rose-600 text-white rounded hover:bg-rose-700">
                          Return to checkout
                      </Link>
                    )}
                    <Link href="/products" className="px-5 py-2.5 bg-white border border-zinc-300 rounded hover:bg-zinc-50 text-zinc-800">Continue shopping</Link>
                </div>
            </div>
        </div>
    );
}


