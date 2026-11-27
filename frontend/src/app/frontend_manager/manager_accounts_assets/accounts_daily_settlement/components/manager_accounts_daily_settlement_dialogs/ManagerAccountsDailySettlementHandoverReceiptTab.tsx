'use client';

import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import {
  DENOMINATIONS,
  formatInrRupees,
  type DenominationCounts,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementDenominationHelpers';
import { Printer, Send } from 'lucide-react';

interface ManagerAccountsDailySettlementHandoverReceiptTabProps {
  entry?: Entry | null;
  counts: DenominationCounts;
  totalPhysicalCash: number;
  discrepancy: number;
  handoverAmount: number;
  retainedFloat: number;
  managerName: string;
  ownerName: string;
  onCopyWhatsApp: () => void;
  onPrintReceipt: () => void;
}

export function ManagerAccountsDailySettlementHandoverReceiptTab({
  entry,
  counts,
  totalPhysicalCash,
  discrepancy,
  handoverAmount,
  retainedFloat,
  managerName,
  ownerName,
  onCopyWhatsApp,
  onPrintReceipt,
}: ManagerAccountsDailySettlementHandoverReceiptTabProps) {
  return (
    <div className="space-y-4">
      <div id="printable-cash-handover-slip" className="p-6 rounded-2xl border-2 border-border bg-white text-slate-900 shadow-md font-sans space-y-4">
        <div className="text-center border-b pb-3 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">LO</span>
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Library OS — Daily Cash Handover Receipt</h3>
          </div>
          <p className="text-xs text-slate-500">Branch: Central Study Hub - Main Branch | Phone: +91 98765 43210</p>
          <p className="text-[11px] font-mono text-slate-400">
            {`Shift: ${entry?.shift || 'Daily Shift'} • Date: ${new Date().toLocaleDateString('en-IN')}`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Total Physical Cash in Drawer:</span>
            <strong className="text-base text-slate-900 font-mono">{formatInrRupees(totalPhysicalCash)}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Discrepancy vs Ledger:</span>
            <strong className={discrepancy === 0 ? 'text-emerald-600' : 'text-rose-600'}>
              {discrepancy === 0 ? `${formatInrRupees(0)} (Exact Match ✓)` : `${formatInrRupees(discrepancy)} Difference`}
            </strong>
          </div>
          <div className="border-t pt-2">
            <span className="text-slate-500 block">Net Handed Over to Owner:</span>
            <strong className="text-lg text-emerald-700 font-mono font-bold">{formatInrRupees(handoverAmount)}</strong>
          </div>
          <div className="border-t pt-2">
            <span className="text-slate-500 block">Retained Drawer Float (Tomorrow):</span>
            <strong className="text-sm text-slate-800 font-mono">{formatInrRupees(retainedFloat)}</strong>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Currency Denominations Detail</h4>
          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
              <tr>
                <th className="py-1 px-3">Denomination</th>
                <th className="py-1 px-3 text-center">Count</th>
                <th className="py-1 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {DENOMINATIONS.map((d) => {
                const count = counts[d.key] || 0;
                if (count === 0) return null;
                return (
                  <tr key={d.key}>
                    <td className="py-1 px-3 font-sans">{d.label}</td>
                    <td className="py-1 px-3 text-center font-bold">{count}</td>
                    <td className="py-1 px-3 text-right">{formatInrRupees(count * d.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
          <div className="space-y-4">
            <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
              <span className="text-[10px] text-slate-400 italic">Signature / Digital Verified</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{managerName}</p>
              <p className="text-[10px] text-slate-500">Handed Over By (Branch Manager)</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
              <span className="text-[10px] text-slate-400 italic">Signature / Receipt Acknowledged</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{ownerName}</p>
              <p className="text-[10px] text-slate-500">Received & Confirmed By (Owner)</p>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 pt-2 border-t">
          Generated via Library OS Daily Settlement Engine • Legally binding physical cash handover record
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={onCopyWhatsApp}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 motion-safe:transition-colors cursor-pointer"
        >
          <Send size={13} />
          <span>Send Summary on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={onPrintReceipt}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card hover:bg-surface-hover text-secondary hover:text-primary border border-border text-xs font-semibold motion-safe:transition-colors cursor-pointer"
        >
          <Printer size={13} />
          <span>Print A4 / Thermal Slip</span>
        </button>
      </div>
    </div>
  );
}
