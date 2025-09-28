import React from 'react';

export function ShippingMethod(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-zinc-800 text-base font-bold uppercase tracking-wide">Shipping Method</h3>
      <div className="rounded-sm bg-white px-5 py-10 flex flex-col items-center gap-4">
        <div className="w-28 h-20 border-2 border-zinc-400" />
        <p className="text-center text-sm text-neutral-500">
          Please select a province/city for a list of shipping methods.
        </p>
      </div>
    </div>
  );
}


