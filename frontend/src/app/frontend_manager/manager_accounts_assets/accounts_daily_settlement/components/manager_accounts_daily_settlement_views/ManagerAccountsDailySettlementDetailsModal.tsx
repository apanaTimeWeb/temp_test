'use client';

import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import {
Building2,
CheckCircle2,
Clock,
Coins,
Printer,
QrCode,
Scale,
ShieldCheck,
TrendingDown,
X
} from 'lucide-react';
import { useEffect } from 'react';

export interface ManagerAccountsDailySettlementDetailsModalProps {
  isOpen: boolean;
  entry: Entry | null;
  dateScopeLabel: string;
  formatCurrency: (val: number) => string;
  onClose: () => void;
  onSettleShift?: (shiftName: string) => void;
}

export function ManagerAccountsDailySettlementDetailsModal({
  isOpen,
  entry,
  dateScopeLabel,
  formatCurrency,
  onClose,
  onSettleShift,
}: ManagerAccountsDailySettlementDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const isSettled = entry.status === 'settled';
  const totalCollections = entry.cashCollected + entry.upiCollected;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settlement-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs motion-safe:animate-in fade-in motion-safe:duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                isSettled
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <Scale size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  SCOPE: {dateScopeLabel}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    isSettled
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isSettled ? 'Verified & Closed' : 'Pending Verification'}
                </span>
              </div>
              <h2 id="settlement-details-title" className="text-base font-bold text-primary mt-1">
                {entry.shift} Shift Reconciliation
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-highlight/70 border border-border">
          <span className="text-xs text-secondary font-medium">Reconciliation Status:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isSettled
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isSettled ? (
              <>
                <CheckCircle2 size={13} /> Settled by {entry.settledBy || 'Branch Manager'}
              </>
            ) : (
              <>
                <Clock size={13} /> Drawer Awaiting Physical Count
              </>
            )}
          </span>
        </div>

        {/* Financial Flow Breakdown */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">Cash Flow Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
              <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
                <Building2 size={12} className="text-secondary" /> Opening Drawer Float
              </span>
              <p className="font-semibold text-primary font-mono text-sm">
                {formatCurrency(entry.openingBalance)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
              <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
                <Coins size={12} className="text-emerald-400" /> Physical Cash Collected (+)
              </span>
              <p className="font-semibold text-emerald-400 font-mono text-sm">
                {formatCurrency(entry.cashCollected)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
              <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
                <QrCode size={12} className="text-indigo-400" /> UPI / QR Payments (+)
              </span>
              <p className="font-semibold text-indigo-400 font-mono text-sm">
                {formatCurrency(entry.upiCollected)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
              <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
                <TrendingDown size={12} className="text-rose-400" /> Counter Petty Expenses (-)
              </span>
              <p className="font-semibold text-rose-400 font-mono text-sm">
                {formatCurrency(entry.expenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Vault Closing Net */}
        <div className="p-3.5 rounded-xl bg-primary-subtle border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary block">Final Shift Closing Balance</span>
            <span className="text-[11px] text-secondary">Opening + Cash + UPI - Expenses</span>
          </div>
          <span className="text-lg font-black font-mono text-primary">
            {formatCurrency(entry.closingBalance)}
          </span>
        </div>

        {/* Audit Note */}
        <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border text-[11px] text-secondary leading-relaxed flex items-start gap-2">
          <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
          <span>
            This record represents the verified branch register log. Cash and digital receipts are cross-referenced with bank settlement timestamps.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
          >
            <Printer size={14} /> Print Shift Voucher
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            {!isSettled && onSettleShift && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSettleShift(entry.shift);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer motion-safe:transition-all"
              >
                <CheckCircle2 size={14} /> Settle This Shift
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsDailySettlementDetailsModal;
