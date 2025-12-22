import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Order, PaymentMethod } from '@/features/order/types';
import { useEnums } from '@/hooks/useEnums';
import { useLanguage } from '@/hooks/useLanguage';

type OrderDetailPresenterProps = {
  order: Order;
  onBack?: () => void;
  onRefund?: (order: Order) => void;
};

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);

export const OrderDetailPresenter: React.FC<OrderDetailPresenterProps> = ({ order, onBack }) => {
  const { data: enums } = useEnums();
  const { translations } = useLanguage();
  const t = translations.orderHistory;
  
  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    switch (method) {
      case 'CASH_ON_DELIVERY':
        return t.cashOnDelivery;
      case 'CREDIT_CARD':
        return t.creditCard;
      default:
        return t.unknown;
    }
  };

  return (
    <div className="px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-black font-bold">{t.orderProductInfo}</h1>
          {onBack ? (
            <button type="button" onClick={onBack} className="text-sm text-gray-800 hover:text-yellow-800 cursor-pointer">{t.backToOrderHistory}</button>
          ) : (
            <Link href="/profile?section=order-info" className="text-sm text-gray-800 hover:text-yellow-800">{t.backToOrderHistory}</Link>
          )}
        </div>

        <div className="border-t-3 border-black pt-2">
          <div className="space-y-6">
            {order.orderDetails.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-24 rounded overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                  <Image 
                    src={item.images?.[0] || '/images/products/image1.jpg'} 
                    alt={item.title} 
                    fill
                    sizes="96px"
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <div className="text-black font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.colorLabel} / {item.sizeLabel}</div>
                  <div className="text-xs text-gray-600 mt-1">{t.quantity}: {item.quantity}</div>
                  
                  {/* Price - Show unit price with promotion discount */}
                  <div className="mt-2">
                    {item.promotionId && item.percentOff != null && item.percentOff > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="text-black font-semibold">
                          {formatPrice(item.unitPrice * (1 - item.percentOff / 100))}
                        </div>
                        <div className="text-sm line-through text-gray-500">
                          {formatPrice(item.unitPrice)}
                        </div>
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          -{item.percentOff}%
                        </span>
                      </div>
                    ) : (
                      <div className="text-black font-semibold">
                        {formatPrice(item.unitPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-base text-black font-semibold mb-4 border-b-3 border-black pb-3">{t.totalAmount}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{t.productPrice}</span>
              <span className="text-black font-semibold">{formatPrice(order.subtotalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{t.shippingFee}</span>
              <span className="text-black font-semibold">{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{t.promotionDiscount}</span>
                <span className="text-red-600 font-semibold">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-base border-t pt-3">
              <span className="text-gray-600 font-bold">{t.totalAmount}</span>
              <span className="text-black font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base text-black font-semibold mb-3 border-b-3 border-black pb-3">{t.billingAddress}</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">{t.paymentStatus}</span><span className="text-black">{enums?.paymentStatus?.[order.paymentStatus] || order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">{t.paymentMethod}</span><span className="text-black">{enums?.paymentMethod?.[order.payments?.[0]?.method || ''] || getPaymentMethodLabel(order.payments?.[0]?.method)}</span></div>
            </div>
          </div>
          <div>
            <h3 className="text-base text-black font-semibold mb-3 border-b-3 border-black pb-3">{t.shippingAddress}</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">{t.shippingStatus}</span><span className="text-black">{order.shipments?.[0]?.status || 'PENDING'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">{t.name}</span><span className="text-black">{order.shippingAddress.fullName}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">{t.phoneNumber}</span><span className="text-black">{order.shippingAddress.phone}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.address}</span>
                <span className="text-black text-right">
                  {[order.shippingAddress.line, order.shippingAddress.ward, order.shippingAddress.districtName, order.shippingAddress.city].filter(Boolean).join(', ')}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-gray-600">{t.country}</span><span className="text-black">Vietnam</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPresenter;


