'use client';

import React from 'react';
import { ShipmentHeader } from '@/features/checkout/components/ShipmentHeader';
import { AddressForm } from '@/features/checkout/components/AddressForm';
import { ShippingMethod } from '@/features/checkout/components/ShippingMethod';
import { PaymentMethods } from '@/features/checkout/components/PaymentMethods';
import { OrderSummary } from '@/features/checkout/components/OrderSummary';

export type CheckoutPresenterProps = {
  // Surface hooks/handlers here later if needed
};

export const CheckoutPresenter: React.FC<CheckoutPresenterProps> = () => {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipment, Address, Shipping + Payment methods */}
          <section className="lg:col-span-2 flex flex-col gap-8">
            {/* Header: Shipment Details + User */}
            <ShipmentHeader />
            <AddressForm />
            <ShippingMethod />
            <PaymentMethods />
          </section>

          {/* Right: Order summary */}
          <aside className="lg:col-span-1 flex flex-col gap-4">
            <OrderSummary />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPresenter;


