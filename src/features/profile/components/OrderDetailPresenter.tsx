import React from 'react';
import Link from 'next/link';
import { Order, PaymentMethod } from '@/features/order/types';

type OrderDetailPresenterProps = {
  order: Order;
  onBack?: () => void;
  imagesByDetailId?: Record<number, string>;
};

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
const getPaymentMethodLabel = (method?: PaymentMethod) => {
  switch (method) {
    case 'CASH_ON_DELIVERY':
      return 'Cash on Delivery';
    case 'CREDIT_CARD':
      return 'Credit Card';
    default:
      return 'Unknown';
  }
};

export const OrderDetailPresenter: React.FC<OrderDetailPresenterProps> = ({ order, onBack, imagesByDetailId }) => {
  return (
    <div className="px-4 pb-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-black font-bold">Order Product Information</h1>
          {onBack ? (
            <button type="button" onClick={onBack} className="text-sm text-gray-800 hover:text-yellow-800">Back to orders history</button>
          ) : (
            <Link href="/profile?section=order-info" className="text-sm text-gray-800 hover:text-yellow-800">Back to orders history</Link>
          )}
        </div>

        <div className="border-t-3 border-black pt-2">
          <div className="space-y-6">
            {order.orderDetails.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-24 rounded overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                  <img src={imagesByDetailId?.[item.productDetailId] || item.imageUrl || '/images/products/image1.jpg'} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-black font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.colorLabel} / {item.sizeLabel} / {item.productDetailId}</div>
                  <div className="text-xs text-gray-600 mt-1">Quantity: {item.quantity}</div>
                  <div className="text-black font-semibold mt-2">{formatPrice(item.unitPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-base text-black font-semibold mb-4 border-b-3 border-black pb-3">Total Amount</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Product Price</span>
              <span className="text-black font-semibold">{formatPrice(order.subtotalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Shipping fee</span>
              <span className="text-black font-semibold">{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Discount</span>
              <span className="text-black font-semibold">{formatPrice(order.discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-base border-t pt-3">
              <span className="text-gray-600 font-bold">Total Amount</span>
              <span className="text-black font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base text-black font-semibold mb-3 border-b-3 border-black pb-3">Billing Address</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Payment Status</span><span className="text-black">{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Payment Method</span><span className="text-black">{getPaymentMethodLabel(order.payments?.[0]?.method)}</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-base text-black font-semibold mb-3 border-b-3 border-black pb-3">Shipping Address</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Shipping Status</span><span className="text-black">{order.shipments?.[0]?.status || 'PENDING'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Name</span><span className="text-black">{order.shippingAddress.fullName}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Phone Number</span><span className="text-black">{order.shippingAddress.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Address</span><span className="text-black">{order.shippingAddress.line}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Province</span><span className="text-black">{order.shippingAddress.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Country</span><span className="text-black">Vietnam</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPresenter;


