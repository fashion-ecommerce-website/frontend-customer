'use client';

import React, { useEffect } from 'react';
import { AddressForm } from '@/features/order/components/AddressForm';
import { PaymentMethods } from '@/features/order/components/PaymentMethods';
import { OrderSummary } from '@/features/order/components/OrderSummary';
import { useOrder } from '@/features/order/hooks/useOrder';
import { ProductItem } from '@/services/api/productApi';
import { Address } from '@/services/api/addressApi';
import { useShippingFee, AddressData } from '@/features/order/hooks/useShippingFee';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectSelectedCartItems } from '@/features/cart/redux/cartSlice';
import { removeMultipleCartItemsAsync } from '@/features/cart/redux/cartSaga';
import { CartItem } from '@/types/cart.types';

export type OrderPresenterProps = {
  onClose?: () => void;
  products?: ProductItem[];
  note?: string;
};

export const OrderPresenter: React.FC<OrderPresenterProps> = ({ onClose, products, note }) => {
  const dispatch = useAppDispatch();
  const selectedCartItems = useAppSelector(selectSelectedCartItems);
  
  // Store original title to restore later
  const originalTitle = React.useRef<string>('');
  
  // Convert CartItem[] to ProductItem[]
  const convertCartItemsToProductItems = (cartItems: CartItem[]): ProductItem[] => {
    return cartItems.map(item => ({
      detailId: item.productDetailId,
      productTitle: item.productTitle,
      productSlug: item.productSlug,
      price: item.price,
      finalPrice: item.finalPrice ?? item.price,
      quantity: item.quantity,
      colorName: item.colorName,
      sizeName: item.sizeName,
      colors: [], // CartItem doesn't have colors array, will be empty
      imageUrls: [item.imageUrl], // Convert single imageUrl to array
    }));
  };
  const {
    selectedAddress,
    loadAddresses,
    selectAddress,
    resetOrder,
  } = useOrder();

  const [addressData, setAddressData] = React.useState<AddressData>({});
  
  // Calculate total item count for shipping weight calculation
  // Backend uses 200g per item, so we need to pass itemCount
  const orderProducts = React.useMemo(() => {
    return products || convertCartItemsToProductItems(selectedCartItems);
  }, [products, selectedCartItems]);
  
  const totalItemCount = React.useMemo(() => {
    return orderProducts.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [orderProducts]);
  
  // Memoize shipping options to prevent infinite loops
  const shippingOptions = React.useMemo(() => ({ itemCount: totalItemCount }), [totalItemCount]);
  
  const shippingFee = useShippingFee(addressData, shippingOptions);

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Change document title when component mounts
  useEffect(() => {
    // Store original title
    originalTitle.current = document.title;
    // Change title to "Order"
    document.title = 'Order';
    
    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle.current;
    };
  }, []);

  // If there is already a selected address, initialize shipping calculation
  useEffect(() => {
    if (selectedAddress) {
      setAddressData({
        province: selectedAddress.city,
        district: selectedAddress.city,
        ward: selectedAddress.ward,
        // Include GHN IDs if available
        provinceId: selectedAddress.provinceId,
        districtId: selectedAddress.districtId,
        wardCode: selectedAddress.wardCode,
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

  const handleAddressSelect = (address: Address) => {
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
    
    // Update address data with GHN IDs for accurate shipping calculation
    setAddressData({
      province: address.city,
      district: address.city,
      ward: address.ward,
      provinceId: address.provinceId,
      districtId: address.districtId,
      wardCode: address.wardCode,
    });
  };

  const handleOrderComplete = (orderId: number) => {
    console.log('Order completed successfully!', { orderId });
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
              products={orderProducts}
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


