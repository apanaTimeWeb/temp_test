'use client';

import { Calculator } from 'lucide-react';

interface SuperadminBillingCreateInvoiceTaxSectionProps {
  taxType: 'intra' | 'inter';
  setTaxType: (v: 'intra' | 'inter') => void;
  subtotal: number;
  setSubtotal: (v: number) => void;
  discount: number;
  setDiscount: (v: number) => void;
  totalAmount: number;
}

export default function SuperadminBillingCreateInvoiceTaxSection({
  taxType,
  setTaxType,
  subtotal,
  setSubtotal,
  discount,
  setDiscount,
  totalAmount,
}: SuperadminBillingCreateInvoiceTaxSectionProps) {
  return (
    <div className="p-3 rounded-xl border border-indigo-500/20 bg-slate-900/50 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <Calculator size={13} className="text-indigo-400" /> GST Tax Calculation
        </span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="taxType"
              checked={taxType === 'intra'}
              onChange={() => setTaxType('intra')}
              className="text-indigo-600"
            />
            <span className="text-slate-300">Intra-State (CGST 9% + SGST 9%)</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="taxType"
              checked={taxType === 'inter'}
              onChange={() => setTaxType('inter')}
              className="text-indigo-600"
            />
            <span className="text-slate-300">Inter-State (IGST 18%)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Base Price (₹)</label>
          <input
            type="number"
            min={1}
            value={subtotal}
            onChange={(e) => setSubtotal(Number(e.target.value))}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-1.5 text-slate-100 font-mono"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Discount (₹)</label>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900 px-3 py-1.5 text-slate-100 font-mono"
          />
        </div>
        <div className="text-right flex flex-col justify-end">
          <span className="text-[11px] text-slate-400">Total with 18% GST:</span>
          <span className="text-base font-black text-emerald-400 font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
