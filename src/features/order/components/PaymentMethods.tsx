import React from 'react';
import { PaymentMethod } from '../types';
import { useOrder } from '../hooks/useOrder';

export function PaymentMethods(): React.ReactElement {
  const { selectedPaymentMethod, selectPaymentMethod } = useOrder();

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    selectPaymentMethod(method);
  };

  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100">
      <h3 className="text-zinc-800 text-base font-bold uppercase tracking-wide">Payment methods</h3>
      <div className="rounded-sm bg-white">
        {/* Stripe */}
        <label className="flex items-center gap-3 px-2 py-2">
          <input 
            type="radio" 
            name="payment" 
            checked={selectedPaymentMethod === PaymentMethod.CREDIT_CARD}
            onChange={() => handlePaymentMethodChange(PaymentMethod.CREDIT_CARD)}
            className="h-4 w-4" 
          />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center">
              <img
                src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg"
                alt="Stripe"
                className="h-6 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">Stripe</div>
              <div className="text-xs text-zinc-500">Pay securely with card via Stripe</div>
            </div>
          </div>
        </label>

        {/* Cash on Delivery */}
        <label className="flex items-center gap-3 px-2 py-2">
          <input 
            type="radio" 
            name="payment" 
            checked={selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY}
            onChange={() => handlePaymentMethodChange(PaymentMethod.CASH_ON_DELIVERY)}
            className="h-4 w-4" 
          />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center">
              <div className="h-6 w-10 flex items-center justify-center rounded border border-zinc-300 text-xs text-zinc-600">
                COD
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">Cash on Delivery</div>
              <div className="text-xs text-zinc-500">Pay with cash upon delivery</div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}


