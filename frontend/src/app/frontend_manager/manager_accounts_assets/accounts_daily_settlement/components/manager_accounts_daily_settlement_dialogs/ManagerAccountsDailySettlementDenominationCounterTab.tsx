'use client';

import {
  CURRENCY_SYMBOL_TEXT,
  DENOMINATIONS,
  formatInrRupees,
  type DenominationCounts,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementDenominationHelpers';
import { AlertTriangle, CheckCircle2, Coins, RotateCcw } from 'lucide-react';

interface ManagerAccountsDailySettlementDenominationCounterTabProps {
  counts: DenominationCounts;
  totalPhysicalCash: number;
  expectedCashRupees: number;
  discrepancy: number;
  retainedFloat: number;
  setRetainedFloat: (val: number) => void;
  handoverAmount: number;
  ownerName: string;
  setOwnerName: (val: string) => void;
  managerName: string;
  setManagerName: (val: string) => void;
  onCountChange: (key: keyof DenominationCounts, value: string) => void;
  onReset: () => void;
}

export function ManagerAccountsDailySettlementDenominationCounterTab({
  counts,
  totalPhysicalCash,
  expectedCashRupees,
  discrepancy,
  retainedFloat,
  setRetainedFloat,
  handoverAmount,
  ownerName,
  setOwnerName,
  managerName,
  setManagerName,
  onCountChange,
  onReset,
}: ManagerAccountsDailySettlementDenominationCounterTabProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-1">
          <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">Physical Cash Counted</span>
          <div className="text-xl font-black font-mono text-primary flex items-center">{formatInrRupees(totalPhysicalCash)}</div>
          <span className="text-[10px] text-secondary">Sum of all currency notes</span>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs space-y-1">
          <span className="text-[11px] text-secondary font-medium uppercase tracking-wider block">Expected Drawer Cash</span>
          <div className="text-xl font-black font-mono text-secondary flex items-center">{formatInrRupees(expectedCashRupees)}</div>
          <span className="text-[10px] text-secondary">Per shift cash ledger</span>
        </div>

        <div
          className={`p-3.5 rounded-xl border shadow-xs space-y-1 ${
            discrepancy === 0
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : discrepancy > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider block">Cash Discrepancy</span>
          <div className="text-xl font-black font-mono flex items-center gap-1.5">
            {discrepancy === 0 ? (
              <>
                <CheckCircle2 size={18} />
                <span>{`${formatInrRupees(0)} (Matched)`}</span>
              </>
            ) : discrepancy > 0 ? (
              <>
                <AlertTriangle size={18} />
                <span>{`+${formatInrRupees(discrepancy)} (Surplus)`}</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                <span>{`-${formatInrRupees(Math.abs(discrepancy))} (Shortage)`}</span>
              </>
            )}
          </div>
          <span className="text-[10px] opacity-80">
            {discrepancy === 0 ? '100% drawer cash balanced' : discrepancy > 0 ? 'Extra cash present in drawer' : 'Cash missing from physical drawer'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface-highlight border-b border-border">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Coins size={14} className="text-emerald-400" />
            <span>Currency Denominations</span>
          </span>
          <button type="button" onClick={onReset} className="text-[11px] text-secondary hover:text-primary flex items-center gap-1 cursor-pointer">
            <RotateCcw size={11} />
            <span>Reset Counts</span>
          </button>
        </div>

        <div className="divide-y divide-border">
          {DENOMINATIONS.map((d) => {
            const count = counts[d.key] || 0;
            const subtotal = count * d.value;
            return (
              <div key={d.key} className="flex items-center justify-between px-4 py-2 hover:bg-surface-hover motion-safe:transition-colors gap-3">
                <div className="flex items-center gap-3 w-40">
                  <span className="w-8 h-8 rounded-lg bg-surface-highlight text-primary font-bold text-xs flex items-center justify-center border border-border">
                    {d.badge}
                  </span>
                  <span className="text-xs font-semibold text-primary">{d.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary font-mono">×</span>
                  <input
                    type="number"
                    min="0"
                    value={count || ''}
                    onChange={(e) => onCountChange(d.key, e.target.value)}
                    placeholder="0"
                    className="w-24 px-3 py-1.5 text-center text-xs font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="w-28 text-right font-mono font-bold text-xs text-primary">{`= ${formatInrRupees(subtotal)}`}</div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-surface-highlight border-t border-border font-bold text-xs">
          <span className="text-primary">Total Physical Cash in Drawer</span>
          <span className="text-base text-emerald-400 font-mono">{formatInrRupees(totalPhysicalCash)}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
          <span>Owner Cash Handover & Retained Float Split</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-secondary font-medium block mb-1">Retained Petty Cash Float for Tomorrow Morning</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">{CURRENCY_SYMBOL_TEXT}</span>
              <input
                type="number"
                min="0"
                value={retainedFloat}
                onChange={(e) => setRetainedFloat(Number(e.target.value) || 0)}
                placeholder="500"
                className="w-full pl-7 pr-3 py-2 text-xs font-mono font-bold bg-background border border-border rounded-lg outline-none focus:border-sky-500"
              />
            </div>
            <span className="text-[10px] text-secondary mt-0.5 block">Amount left in the counter cash drawer for morning change</span>
          </div>

          <div>
            <label className="text-[11px] text-secondary font-medium block mb-1">Net Cash Handed Over to Library Owner</label>
            <div className="px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono font-bold text-sm flex items-center justify-between">
              <span>To Handover:</span>
              <span>{formatInrRupees(handoverAmount)}</span>
            </div>
            <span className="text-[10px] text-sky-400 mt-0.5 block">
              {`Total Counted (${formatInrRupees(totalPhysicalCash)}) - Retained Float (${formatInrRupees(retainedFloat)})`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="text-[11px] text-secondary block mb-1">Handover Received By (Owner / Authority)</label>
            <input
              maxLength={100}
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-secondary block mb-1">Handed Over By (Manager / Cashier)</label>
            <input
              maxLength={100}
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
