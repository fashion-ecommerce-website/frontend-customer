import React from 'react';

export function OrderSummary(): React.ReactElement {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-zinc-800 text-base font-bold tracking-wide">ORDER SUMMARY</h3>
        </div>
        <div className="text-zinc-800 text-xl font-bold tracking-wide">6,130,000₫</div>
      </div>

      <div className="bg-gray-50 rounded-md p-4">
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-24 w-24 shrink-0 rounded-lg bg-white overflow-hidden">
                <img
                  alt="product"
                  src="https://placehold.co/100x100"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-neutral-600 text-base font-bold uppercase tracking-wide">MLB</div>
                <p className="text-neutral-600 text-sm line-clamp-2">
                  {i === 1
                    ? 'Unisex Round Neck Short Sleeve Classic Monogram T-Shirt'
                    : 'Unisex Varsity Stripe Overfit Polo Shirt'}
                </p>
                <div className="mt-1 text-xs text-zinc-800">
                  {i === 1 ? '50BKS / XS / 3ATSM0134' : '43NYS / S / 3APQV0253'}
                </div>
                <div className="mt-1 flex items-start justify-between">
                  <span className="text-sm font-bold text-neutral-600">
                    {i === 1 ? '1,150,000₫' : '4,980,000₫'}
                  </span>
                  <span className="text-sm font-bold text-neutral-600">Quantity: {i === 1 ? 1 : 2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Discount code</label>
            <input
              className="w-full rounded-l border border-neutral-400 px-3.5 py-3 text-sm placeholder-neutral-300 focus:outline-none"
              placeholder="Discount code"
            />
          </div>
          <button className="h-[44px] shrink-0 rounded-r bg-zinc-800 px-5 text-xs font-bold uppercase tracking-widest text-white">
            Use
          </button>
        </div>

        <div className="mt-4">
          <span className="text-base text-zinc-800">Loyal customers</span>
        </div>

        <div className="mt-4 rounded-sm bg-gray-50 p-4">
          <div className="flex items-start justify-between py-1">
            <span className="text-sm font-bold text-zinc-800">Subtotal</span>
            <span className="text-sm font-bold text-neutral-600">6,130,000₫</span>
          </div>
          <div className="py-1">
            <span className="text-sm font-bold text-zinc-800">Discount</span>
          </div>
          <div className="flex items-start justify-between py-1">
            <span className="text-sm text-zinc-800">Shipping fee</span>
            <span className="text-sm text-neutral-600">+ —</span>
          </div>
          <div className="mt-4 flex items-start justify-between pt-4 border-t border-zinc-100">
            <span className="text-xl font-bold uppercase tracking-wide text-neutral-600">Total payment</span>
            <span className="text-xl font-bold uppercase tracking-wide text-neutral-600">6,130,000₫</span>
          </div>
        <div className="mt-4 w-full grid grid-cols-2 gap-3">
          <button type="button" className="w-full inline-flex">
            <div className="flex h-12 w-full items-center justify-center gap-2 bg-white px-6">
              <div className="w-5 h-5 relative">
                <div className="w-4 h-4 left-[2px] top-[2px] absolute outline outline-1 outline-offset-[-0.5px] outline-zinc-800" />
              </div>
              <div className="text-center text-zinc-800 text-sm font-bold uppercase leading-tight tracking-wide">Back to Cart</div>
            </div>
          </button>
          <button type="button" className="w-full inline-flex">
            <div className="flex h-12 w-full items-center justify-center bg-zinc-400 px-6">
              <div className="text-center text-white text-sm font-semibold uppercase leading-tight tracking-wide">COMPLETE ORDER</div>
            </div>
          </button>
        </div>
        </div>
      </div>
    </>
  );
}


