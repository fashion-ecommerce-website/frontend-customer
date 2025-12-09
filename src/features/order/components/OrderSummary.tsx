import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShippingFeeData } from '@/features/order/hooks/useShippingFee';
import { mockOrderProducts, calculateOrderTotals } from '@/features/order/mockData';
import { ProductItem } from '@/services/api/productApi';
import { useOrder } from '@/features/order/hooks/useOrder';
import { CreateOrderRequest, PaymentMethod } from '../types';
import { validateOrderData } from '@/utils/orderValidation';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PaymentApi } from '@/services/api/paymentApi';
import { useAppDispatch } from '@/hooks/redux';
import { VoucherModal, Voucher, VoucherByUserResponse } from './VoucherModal';
import { voucherApi } from '@/services/api/voucherApi';
import { apiClient } from '@/services/api/baseApi';


interface OrderSummaryProps {
	onClose?: () => void;
	shippingFee?: ShippingFeeData;
	products?: ProductItem[];
	onOrderComplete?: (orderId: number) => void;
	note?: string;
}

export function OrderSummary({ 
	onClose, 
	shippingFee, 
	products = mockOrderProducts, 
	onOrderComplete,
	note,
}: OrderSummaryProps): React.ReactElement {
	const router = useRouter();
	const [isItemsVisible, setIsItemsVisible] = useState(products.length < 2);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
	const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		type: 'danger' | 'warning' | 'info';
		onConfirm: () => void;
	}>({
		isOpen: false,
		title: '',
		message: '',
		type: 'info',
		onConfirm: () => {},
	});
	
	const {
		selectedAddress,
		selectedPaymentMethod,
		createOrder,
		isOrderLoading,
		orderError,
		order,
	} = useOrder();
	useAppDispatch();

	const [vouchers, setVouchers] = React.useState<Voucher[]>([]);

	React.useEffect(() => {
		let cancelled = false;
		voucherApi.getVouchersByUser()
			.then(res => {
				if (cancelled) return;
				if (res.success && Array.isArray(res.data)) {
					setVouchers(res.data as Voucher[]);
				}
			})
			.catch(() => {
				// Error handling can be added here if needed
			});
		return () => { cancelled = true; };
	}, []);

	// Search voucher function
	const handleSearchVoucher = async (code: string, subtotal: number): Promise<VoucherByUserResponse[]> => {
		const params = new URLSearchParams();
		if (subtotal) params.append('subtotal', subtotal.toString());
		if (code.trim()) params.append('searchCode', code.trim());
		
		const endpoint = `/vouchers/by-user${params.toString() ? `?${params.toString()}` : ''}`;
		const response = await apiClient.get<VoucherByUserResponse[]>(endpoint);
		
		if (!response.success || !response.data) {
			throw new Error(response.message || 'Failed to search vouchers');
		}
		
		return response.data;
	};
	
	// Calculate totals from products with promotion support
	const orderTotals = calculateOrderTotals(products);
	const subtotal = orderTotals.subtotal;
	
	const computeVoucherDiscount = (voucher: Voucher | null): number => {
		if (!voucher) return 0;
		if (voucher.discountType === 'amount') return Math.min(voucher.value, subtotal);
		let byPercent = Math.floor((subtotal * voucher.value) / 100);
		if (typeof voucher.maxDiscountAmount === 'number') {
			byPercent = Math.min(byPercent, voucher.maxDiscountAmount);
		}
		return Math.min(byPercent, subtotal);
	};
	const voucherDiscount = computeVoucherDiscount(selectedVoucher);
	const total = Math.max(0, subtotal - voucherDiscount) + (shippingFee?.fee || 0);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
		}).format(price);
	};

	const handleCompleteOrder = () => {
		// Use selectedAddress from Redux
		const addressId = selectedAddress?.id;
		
		// Validate order data before showing confirmation
		const validation = validateOrderData({
			shippingAddressId: addressId,
			products,
			subtotalAmount: subtotal,
			totalAmount: total
		});

		if (!validation.isValid) {
			setSubmitError(validation.errors.join('. '));
			return;
		}

		setSubmitError(null);

		// Show confirmation modal
		const voucherText = voucherDiscount > 0 ? `\nVoucher Discount: ${formatPrice(voucherDiscount)}` : '';
		
		setConfirmModal({
			isOpen: true,
			title: 'Complete Order',
			message: `Are you sure you want to complete this order?\n\nSubtotal: ${formatPrice(subtotal)}${voucherText}\nShipping: ${formatPrice(shippingFee?.fee || 0)}\nTotal Amount: ${formatPrice(total)}\nPayment Method: ${selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY ? 'Cash on Delivery' : 'Credit Card'}\n\nThis action cannot be undone.`,
			type: 'info',
			onConfirm: () => {
				setConfirmModal(prev => ({ ...prev, isOpen: false }));
				performOrderSubmission();
			},
		});
	};

	const performOrderSubmission = async () => {
		const addressId = selectedAddress?.id;

		const orderData: CreateOrderRequest = {
			shippingAddressId: addressId!,
			note: note || '',
			subtotalAmount: subtotal,
			discountAmount: voucherDiscount, 
			shippingFee: shippingFee?.fee || 0,
			totalAmount: total,
			paymentMethod: selectedPaymentMethod,
			voucherCode: selectedVoucher?.code, 
			orderDetails: products.map(product => ({
				productDetailId: product.detailId,
				quantity: product.quantity,
				promotionId: product.promotionId 
			}))
		};

		createOrder(orderData);
	};

	// Trigger next step when order is created
	React.useEffect(() => {
		if (!order) return;

		// Find the latest payment created for this order
		const latestPayment = Array.isArray(order.payments) ? [...order.payments].sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		})[0] : undefined;

        if (selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            // Call onOrderComplete BEFORE navigation to clear cart
            if (onOrderComplete) onOrderComplete(order.id);
            // Use Next.js router instead of window.location to avoid full page reload
            router.push(`/checkout/success?status=success&orderId=${order.id}&payment=unpaid`);
            return;
        }

        // Card/Stripe: create checkout session and redirect
        if (selectedPaymentMethod === PaymentMethod.CREDIT_CARD && latestPayment?.id) {
            const successUrl = `${window.location.origin}/checkout/success?orderId=${order.id}`; 
            const cancelUrl = `${window.location.origin}/checkout/success?status=cancel&orderId=${order.id}&paymentId=${latestPayment.id}`; // handle cancel on same page
			PaymentApi.createCheckout({ paymentId: latestPayment.id, successUrl, cancelUrl })
				.then(res => {
					if (res.success && res.data?.checkoutUrl) {
                		// Call onOrderComplete BEFORE navigation to clear cart
                		if (onOrderComplete) onOrderComplete(order.id);
						// For Stripe checkout, we must use window.location to go to external URL
						window.location.href = res.data.checkoutUrl;
					} else {
						setSubmitError(res.message || 'Failed to initiate payment');
					}
				})
				.catch(err => {
					setSubmitError(err?.message || 'Failed to initiate payment');
				});
		}
	}, [order, onOrderComplete, selectedPaymentMethod, router]);

	// Handle order errors
	React.useEffect(() => {
		if (orderError) {
			if (orderError.includes('does not belong to user')) {
				setSubmitError('The selected shipping address is not valid. Please select a different address.');
			} else if (orderError.includes('not found')) {
				setSubmitError('The selected shipping address was not found. Please select a different address.');
			} else {
				setSubmitError(orderError);
			}
		}
	}, [orderError]);
	const isCompleteDisabled = isOrderLoading || !selectedAddress;

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-zinc-800 text-base font-bold tracking-wide">ORDER SUMMARY</h3>
					<span className="text-xs text-gray-500">({products.length} {products.length === 1 ? 'item' : 'items'})</span>
					<button
						type="button"
						onClick={() => setIsItemsVisible(!isItemsVisible)}
						className="p-1 hover:bg-gray-100 rounded transition-colors"
					>
						<svg 
							width="20" 
							height="20" 
							viewBox="0 0 20 20" 
							fill="none" 
							xmlns="http://www.w3.org/2000/svg"
							className={`transition-transform ${isItemsVisible ? 'rotate-180' : 'rotate-0'}`}
						>
							<path d="M16.25 7.5L10 13.75L3.75 7.5" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
				<div className="text-zinc-800 text-xl font-bold tracking-wide">{formatPrice(total)}</div>
			</div>

		<div className="bg-gray-50 rounded-md p-4">
			{isItemsVisible && (
				<div className="flex flex-col gap-4">
					{products.map((product) => (
						<div key={product.detailId} className="flex gap-3">
							<div className="h-24 w-24 shrink-0 rounded-lg bg-white overflow-hidden">
								<img
									alt={product.productTitle}
									src={product.imageUrls[0] || "https://placehold.co/100x100"}
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="flex-1">
								<p className="text-neutral-600 text-sm line-clamp-2">
									{product.productTitle}
								</p>
								<div className="mt-1 text-xs text-zinc-800">
									{product.colorName} / {product.sizeName}
								</div>
								<div className="mt-1 flex items-center justify-between">
									<div className="flex items-center gap-2">
										{product.finalPrice && product.finalPrice < product.price ? (
											<>
												<span className="text-sm font-bold text-neutral-600">
													{formatPrice(product.finalPrice)}
												</span>
												<span className="text-xs line-through text-gray-500">
													{formatPrice(product.price)}
												</span>
											</>
										) : (
											<span className="text-sm font-bold text-neutral-600">
												{formatPrice(product.price)}
											</span>
										)}
									</div>
									<span className="text-sm font-bold text-neutral-600">Quantity: {product.quantity}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="mt-6">
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Voucher</label>
				<button
					type="button"
					onClick={() => setIsVoucherModalOpen(true)}
					className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-black rounded flex items-center justify-center gap-2 bg-white text-zinc-800 transition-colors cursor-pointer"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12a2 2 0 110-4 2 2 0 010 4zM4 6h12a2 2 0 012 2v1a3 3 0 100 6v1a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
					<span className="text-sm font-semibold">{selectedVoucher ? 'Change Voucher' : 'Select Voucher'}</span>
				</button>
				{selectedVoucher && (
					<div className="mt-2 text-sm text-zinc-800 flex items-center gap-2">
						<span className="px-2 py-0.5 text-xs rounded-full border border-black">{selectedVoucher.code}</span>
						<span className="font-semibold">{selectedVoucher.label}</span>
						<span className="text-green-700">{selectedVoucher.discountType === 'amount' ? `- ${formatPrice(selectedVoucher.value)}` : `- ${selectedVoucher.value}%`}</span>
					</div>
				)}
			</div>

			<div className="mt-4">
				<span className="text-base text-zinc-800">Loyal customers</span>
			</div>

			<div className="mt-4 rounded-sm bg-gray-50 p-4">
				<div className="flex items-start justify-between py-1">
					<span className="text-sm font-bold text-zinc-800">Subtotal</span>
					<span className="text-sm font-bold text-neutral-600">{formatPrice(subtotal)}</span>
				</div>
				
				{voucherDiscount > 0 && (
					<div className="py-1 flex items-start justify-between">
						<span className="text-sm font-bold text-zinc-800">Voucher Discount</span>
						<span className="text-sm font-bold text-green-700">- {formatPrice(voucherDiscount)}</span>
					</div>
				)}
				<div className="flex items-start justify-between py-1">
					<span className="text-sm text-zinc-800">Shipping fee</span>
					<span className="text-sm text-neutral-600">
						{shippingFee?.isCalculating ? (
							<span className="text-blue-600">Calculating...</span>
						) : shippingFee?.error ? (
							<span className="text-red-600">Error</span>
						) : selectedAddress ? (
							`+ ${formatPrice(shippingFee?.fee || 0)}`
						) : (
							<span className="text-neutral-500">Select address to calculate</span>
						)}
					</span>
				</div>
			</div>
		</div>

		{/* Sticky Footer with Total Payment and Buttons */}
		<div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 -mx-4 -mb-4">
			<div className="rounded-sm bg-gray-50 p-4">
				<div className="flex items-start justify-between pt-0 border-t-0">
					<span className="text-xl font-bold uppercase tracking-wide text-neutral-600">Total payment</span>
					<span className="text-xl font-bold uppercase tracking-wide text-neutral-600">
						{shippingFee?.isCalculating ? (
							<span className="text-blue-600">Calculating...</span>
						) : (
							formatPrice(total)
						)}
					</span>
				</div>
			{submitError && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-red-600 text-sm">{submitError}</p>
				</div>
			)}

			<div className="mt-4 w-full grid grid-cols-2 gap-3">
				<button 
					type="button" 
					className="w-full inline-flex"
					onClick={onClose}
					disabled={isOrderLoading}
				>
					<div className="flex h-12 w-full items-center justify-center gap-2 bg-white px-6 cursor-pointer disabled:opacity-50 border border-gray-300 rounded">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke="#2E2E2E" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<div className="text-center text-zinc-800 text-sm font-bold uppercase leading-tight tracking-wide">Back to Cart</div>
					</div>
				</button>
				<button 
					type="button" 
					className="w-full inline-flex cursor-pointer"
					onClick={handleCompleteOrder}
					disabled={isCompleteDisabled}
				>
					<div className="flex h-12 w-full items-center justify-center bg-zinc-800 hover:bg-zinc-700 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded">
						<div className="text-center text-white text-sm font-semibold uppercase leading-tight tracking-wide">
							{isOrderLoading ? 'PROCESSING...' : (!selectedAddress ? 'SELECT ADDRESS' : 'COMPLETE ORDER')}
						</div>
					</div>
				</button>
			</div>
			</div>
		</div>			{/* Confirm Modal */}
			<ConfirmModal
				isOpen={confirmModal.isOpen}
				title={confirmModal.title}
				message={confirmModal.message}
				type={confirmModal.type}
				confirmText="Complete Order"
				cancelText="Cancel"
				onConfirm={confirmModal.onConfirm}
				onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
				isLoading={isOrderLoading}
			/>

			{/* Voucher Modal */}
			<VoucherModal
				isOpen={isVoucherModalOpen}
				vouchers={vouchers}
				subtotal={subtotal}
				onClose={() => setIsVoucherModalOpen(false)}
				onSelect={(v) => { setSelectedVoucher(v); setIsVoucherModalOpen(false); }}
				onApplyCode={(code) => {
					const found = vouchers.find(v => v.code.toLowerCase() === code.toLowerCase());
					if (found) {
						setSelectedVoucher(found);
						setIsVoucherModalOpen(false);
					}
				}}
				onSearchVoucher={handleSearchVoucher}
			/>
		</>
	);
}


