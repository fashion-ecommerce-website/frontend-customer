import React from 'react';

export type ShipmentHeaderProps = {
  userLabel?: string;
  onLogout?: () => void;
};

export function ShipmentHeader({ userLabel = '(K17 DN)', onLogout }: ShipmentHeaderProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-zinc-800 text-base font-bold uppercase tracking-wide">Shipment Details</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
          <img
            alt="avatar"
            src="https://placehold.co/80x80"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-wrap items-end justify-between">
          <span className="text-zinc-800 text-sm">{userLabel}</span>
          <button type="button" className="text-sm font-bold underline text-zinc-800" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}


