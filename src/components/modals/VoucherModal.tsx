'use client';

import React from 'react';

export type Voucher = {
  id: string | number;
  code: string;
  label: string;
  discountType: 'amount' | 'percent';
  value: number; // amount in VND or percent (0-100)
  minSubtotal?: number; // optional minimum subtotal requirement
  maxDiscountAmount?: number; // optional cap for percent discounts
  expiresAt?: string; // ISO date string
  userUsage?: { used: number; limit: number };
  globalUsagePercent?: number; // 0..100 visual only
  available?: boolean; // server-side eligibility flag
  message?: string; // server-side reason when not available
};

interface VoucherModalProps {
  isOpen: boolean;
  vouchers: Voucher[];
  subtotal: number;
  onClose: () => void;
  onSelect: (voucher: Voucher) => void;
  onApplyCode?: (code: string) => void; // optional external handler
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, vouchers, subtotal, onClose, onSelect, onApplyCode }) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);
  const [code, setCode] = React.useState('');

  const computeDiscountPreview = (voucher: Voucher): string => {
    if (voucher.discountType === 'amount') {
      return `- ${formatPrice(voucher.value)}`;
    }
    let amount = Math.floor((subtotal * voucher.value) / 100);
    if (typeof voucher.maxDiscountAmount === 'number') {
      amount = Math.min(amount, voucher.maxDiscountAmount);
    }
    return `- ${formatPrice(amount)}`;
  };

  const isEligible = (voucher: Voucher): boolean => {
    const passesMin = typeof voucher.minSubtotal === 'number' ? subtotal >= voucher.minSubtotal : true;
    const serverAvailable = voucher.available !== undefined ? voucher.available : true;
    return passesMin && serverAvailable;
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 relative shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">🏷️</span>
            <h2 className="text-xl font-semibold text-black">Select Voucher</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Enter code */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Search Voucher</label>
            <div className="flex items-center gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter voucher code..."
                className="flex-1 h-11 rounded border border-gray-300 px-3.5 text-sm text-black placeholder-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const found = vouchers.find(v => v.code.toLowerCase() === code.trim().toLowerCase());
                  if (found && isEligible(found)) {
                    onSelect(found);
                  } else if (onApplyCode) {
                    onApplyCode(code.trim());
                  }
                }}
                className="h-11 shrink-0 rounded bg-black hover:bg-gray-900 px-5 text-sm font-bold uppercase tracking-wide text-white transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Available list */}
          <div className="mt-6">
            <div className="text-sm text-gray-700 font-semibold mb-3">Available Vouchers</div>
            <div className="space-y-4">
              {vouchers.length === 0 && (
                <div className="text-sm text-gray-600">No vouchers available.</div>
              )}
              {vouchers.map((v) => {
                const eligible = isEligible(v);
                return (
                  <div key={v.id} className={`rounded-lg p-4 border ${eligible ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-black text-white text-xs">🏷️</span>
                          <div className="text-black font-semibold truncate">{v.label}</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${eligible ? 'text-black border-black' : 'text-gray-500 border-gray-400'}`}>{eligible ? 'Available' : 'Not Eligible'}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Code: <span className="font-mono">{v.code}</span></div>
                        {typeof v.minSubtotal === 'number' && (
                          <div className="text-xs text-gray-500 mt-1">Min. order: {formatPrice(v.minSubtotal)}</div>
                        )}
                        {!eligible && v.message && (
                          <div className="text-xs text-gray-500 mt-1">{v.message}</div>
                        )}
                        
                        <div className="flex items-center gap-6 text-[11px] text-gray-600 mt-2">
                          {typeof v.maxDiscountAmount === 'number' && (
                            <span>Max: {formatPrice(v.maxDiscountAmount)}</span>
                          )}
                          {v.expiresAt && (
                            <span>Expires: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}</span>
                          )}
                          
                        </div>
                      </div>
                      <div className="pl-4 flex flex-col items-end">
                        <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{computeDiscountPreview(v)}</div>
                        <button
                          type="button"
                          className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-black hover:bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!eligible}
                          onClick={() => onSelect(v)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;


