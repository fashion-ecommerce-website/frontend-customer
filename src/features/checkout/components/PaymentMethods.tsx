import React from 'react';

export function PaymentMethods(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100">
      <h3 className="text-zinc-800 text-base font-bold uppercase tracking-wide">Payment methods</h3>
      <div className="rounded-sm bg-white">
        <label className="flex items-center gap-3 px-2 py-2">
          <input type="radio" name="payment" className="h-4 w-4" />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 border" />
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">Payoo Wallet</div>
              <div className="flex gap-2 mt-1">
                <div className="h-6 w-6 border" />
                <div className="h-6 w-6 border" />
                <div className="h-6 w-6 border" />
                <div className="h-6 w-6 border" />
              </div>
            </div>
          </div>
        </label>
        <label className="flex items-center gap-3 px-2 py-2">
          <input type="radio" name="payment" className="h-4 w-4" />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 border" />
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">Momo</div>
            </div>
          </div>
        </label>
        <label className="flex items-center gap-3 px-2 py-2">
          <input type="radio" name="payment" className="h-4 w-4" />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 border" />
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">VNPAY</div>
            </div>
          </div>
        </label>
        <label className="flex items-center gap-3 px-2 py-2">
          <input type="radio" name="payment" defaultChecked className="h-4 w-4" />
          <div className="flex-1 flex items-center gap-3">
            <div className="h-10 w-10 border" />
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-800">ZaloPay x VietQR</div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}


