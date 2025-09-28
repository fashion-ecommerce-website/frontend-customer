import React, { useState } from 'react';
import { ShippingFeeData } from '@/features/order/hooks/useShippingFee';
import { mockOrderProducts, calculateOrderTotals } from '@/features/order/mockData';
import { ProductItem } from '@/services/api/productApi';
import { useOrder } from '@/features/order/hooks/useOrder';
import { CreateOrderRequest, PaymentMethod } from '../types';
import { validateOrderData } from '@/utils/orderValidation';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

interface OrderSummaryProps {
  onClose?: () => void;
  shippingFee?: ShippingFeeData;
  products?: ProductItem[];
  onOrderComplete?: (orderId: number) => void;
}

export function OrderSummary({ 
  onClose, 
  shippingFee, 
  products = mockOrderProducts, 
  onOrderComplete 
}: OrderSummaryProps): React.ReactElement {
  const [isItemsVisible, setIsItemsVisible] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
  
  // Calculate totals from products
  const orderTotals = calculateOrderTotals(products);
  const subtotal = orderTotals.subtotal;
  const total = subtotal + (shippingFee?.fee || 0);

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
    setConfirmModal({
      isOpen: true,
      title: 'Complete Order',
      message: `Are you sure you want to complete this order?\n\nTotal Amount: ${formatPrice(total)}\nPayment Method: ${selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY ? 'Cash on Delivery' : 'Credit Card'}\n\nThis action cannot be undone.`,
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
      note: "Giao hàng nhanh trong ngày",
      subtotalAmount: subtotal,
      discountAmount: 0,
      shippingFee: shippingFee?.fee || 0,
      totalAmount: total,
      paymentMethod: selectedPaymentMethod,
      orderDetails: products.map(product => ({
        productDetailId: product.detailId,
        quantity: product.quantity
      }))
    };

    createOrder(orderData);
  };

  // Handle order completion when order is successfully created
  React.useEffect(() => {
    if (order && onOrderComplete) {
      onOrderComplete(order.id);
    }
  }, [order, onOrderComplete]);

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
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-800 text-base font-bold tracking-wide">ORDER SUMMARY</h3>
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
                  <div className="text-neutral-600 text-base font-bold uppercase tracking-wide">MLB</div>
                  <p className="text-neutral-600 text-sm line-clamp-2">
                    {product.productTitle}
                  </p>
                  <div className="mt-1 text-xs text-zinc-800">
                    {product.colorName} / {product.detailId}
                  </div>
                  <div className="mt-1 flex items-start justify-between">
                    <span className="text-sm font-bold text-neutral-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm font-bold text-neutral-600">Quantity: {product.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-end">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Discount code</label>
            <input
              className="w-full h-12 rounded-l border border-neutral-400 px-3.5 py-3 text-sm text-black placeholder-neutral-300 focus:outline-none"
              placeholder="Discount code"
            />
          </div>
          <button className="h-12 shrink-0 rounded-r bg-zinc-800 hover:bg-zinc-700 px-5 text-xs font-bold uppercase tracking-widest text-white cursor-pointer transition-colors">
            Use
          </button>
        </div>

        <div className="mt-4">
          <span className="text-base text-zinc-800">Loyal customers</span>
        </div>

        <div className="mt-4 rounded-sm bg-gray-50 p-4">
          <div className="flex items-start justify-between py-1">
            <span className="text-sm font-bold text-zinc-800">Subtotal</span>
            <span className="text-sm font-bold text-neutral-600">{formatPrice(subtotal)}</span>
          </div>
          <div className="py-1">
            <span className="text-sm font-bold text-zinc-800">Discount</span>
          </div>
          <div className="flex items-start justify-between py-1">
            <span className="text-sm text-zinc-800">Shipping fee</span>
            <span className="text-sm text-neutral-600">
              {shippingFee?.isCalculating ? (
                <span className="text-blue-600">Calculating...</span>
              ) : shippingFee?.error ? (
                <span className="text-red-600">Error</span>
              ) : (
                `+ ${formatPrice(shippingFee?.fee || 0)}`
              )}
            </span>
          </div>
          <div className="mt-4 flex items-start justify-between pt-4 border-t border-zinc-100">
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
            <div className="flex h-12 w-full items-center justify-center gap-2 bg-white px-6 cursor-pointer disabled:opacity-50">
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
            disabled={isOrderLoading}
          >
            <div className="flex h-12 w-full items-center justify-center bg-zinc-800 hover:bg-zinc-700 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="text-center text-white text-sm font-semibold uppercase leading-tight tracking-wide">
                {isOrderLoading ? 'PROCESSING...' : 'COMPLETE ORDER'}
              </div>
            </div>
          </button>
        </div>
        </div>
      </div>

      {/* Confirm Modal */}
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
    </>
  );
}


