'use client';

import React, { useEffect } from 'react';
import { AddressForm } from '@/features/order/components/AddressForm';
import { PaymentMethods } from '@/features/order/components/PaymentMethods';
import { OrderSummary } from '@/features/order/components/OrderSummary';
import { useOrder } from '@/features/order/hooks/useOrder';
import { ProductItem } from '@/services/api/productApi';
import { useShippingFee, AddressData } from '@/features/order/hooks/useShippingFee';
import { useToast } from '@/providers/ToastProvider';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectSelectedCartItems } from '@/features/cart/redux/cartSlice';
import { removeMultipleCartItemsAsync } from '@/features/cart/redux/cartSaga';

export type OrderPresenterProps = {
  onClose?: () => void;
  products?: ProductItem[];
  note?: string;
};

export const OrderPresenter: React.FC<OrderPresenterProps> = ({ onClose, products, note }) => {
  const dispatch = useAppDispatch();
  const selectedCartItems = useAppSelector(selectSelectedCartItems);
  const {
    selectedAddress,
    loadAddresses,
    selectAddress,
    createOrder,
    order,
    isOrderLoading,
    orderError,
    resetOrder,
  } = useOrder();

  const { showSuccess } = useToast();
  const [addressData, setAddressData] = React.useState<AddressData>({});
  const shippingFee = useShippingFee(addressData);

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // If there is already a selected address, initialize shipping calculation
  useEffect(() => {
    if (selectedAddress) {
      setAddressData({
        province: selectedAddress.city,
        district: selectedAddress.city,
        ward: selectedAddress.ward,
      });
    }
  }, [selectedAddress]);

  const handleAddressChange = (values: Record<string, string>) => {
    setAddressData({
      province: values.province || '',
      district: values.district || '',
      ward: values.ward || '',
    });
  };

  const handleAddressSelect = (address: any) => {
    selectAddress(address);
    // Also update address data for shipping calculation
    handleAddressChange({
      province: address.city,
      district: address.city,
      ward: address.ward,
      address: address.line,
      name: address.fullName,
      phone: address.phone,
    });
  };

  const handleOrderComplete = (orderId: number) => {
    console.log('Order completed successfully!', { orderId });
    // Show success toast notification
    showSuccess(`Đơn hàng #${orderId} đã được tạo thành công!`);
    // Reset order state after successful completion
    resetOrder();

    // Remove selected items from cart in bulk (best-effort)
    try {
      const ids = selectedCartItems.map(item => item.id);
      if (ids.length > 0) {
        dispatch(removeMultipleCartItemsAsync(ids));
      }
    } catch {}

    // Close modal
    if (onClose) onClose();
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Address + Payment methods */}
          <section className="flex flex-col gap-8">
            <AddressForm 
              onChange={handleAddressChange} 
              onAddressSelect={handleAddressSelect}
            />
            <PaymentMethods />
          </section>

          {/* Right: Order summary */}
          <aside className="flex flex-col gap-4">
            <OrderSummary 
              onClose={onClose} 
              shippingFee={shippingFee}
              products={products}
              note={note}
              onOrderComplete={handleOrderComplete}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderPresenter;


