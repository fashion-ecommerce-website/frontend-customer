import React from 'react';

export type AddressFormProps = {
  onChange?: (values: Record<string, string>) => void;
};

export function AddressForm({ onChange }: AddressFormProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Add a new address ...
        </label>
        <div className="relative">
          <input
            className="w-full rounded border border-neutral-400 px-3.5 py-3.5 text-sm text-zinc-800 placeholder-neutral-300 focus:outline-none"
            placeholder="70000, Vietnam"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Your name</label>
          <input
            className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm text-zinc-800 placeholder-neutral-300 focus:outline-none"
            placeholder="(K17 DN) Nguyen Quoc Hoang"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Phone</label>
          <input
            className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm placeholder-zinc-500 focus:outline-none"
            placeholder="Your phone"
          />
          <p className="text-xs text-red-400">
            Invalid phone number (length should be 10-11 characters, no special characters or spaces)
          </p>
        </div>
      </div>

      <div className="rounded-sm bg-white">
        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="shippingMethod" defaultChecked className="h-4 w-4" />
            <span className="text-base font-bold text-zinc-800">Shipping</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="shippingMethod" className="h-4 w-4" />
            <span className="text-base font-bold text-zinc-800">Pick up at store</span>
          </label>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Address</label>
            <input
              className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm placeholder-neutral-300 focus:outline-none"
              placeholder="Address"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Province</label>
            <input
              className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm text-zinc-800 placeholder-neutral-300 focus:outline-none"
              placeholder="Select a province"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">District</label>
            <input
              className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm text-zinc-800 placeholder-neutral-300 focus:outline-none"
              placeholder="Select a District / District"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Wards</label>
            <input
              className="w-full rounded border border-neutral-400 px-3.5 py-3 text-sm text-zinc-800 placeholder-neutral-300 focus:outline-none"
              placeholder="Select ward"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-zinc-500 pb-4">
        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="addressType" defaultChecked className="h-4 w-4" />
            <span className="text-base font-bold text-zinc-800">Home</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="addressType" className="h-4 w-4" />
            <span className="text-base font-bold text-zinc-800">Company</span>
          </label>
        </div>
      </div>
    </div>
  );
}


