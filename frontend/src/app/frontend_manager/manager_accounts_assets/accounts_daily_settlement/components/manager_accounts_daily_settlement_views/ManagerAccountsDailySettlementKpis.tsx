'use client';
import { Coins, QrCode, TrendingDown, Scale } from 'lucide-react';

interface ManagerAccountsDailySettlementKpisProps {
  totalCash: number;
  totalUpi: number;
  totalExp: number;
  netSurplus: number;
  dateScopeLabel: string;
  formatCurrency: (val: number) => string;
  labels: {
    cashCollected: string;
    upiCollected: string;
    expenses: string;
    net: string;
  };
}

export function ManagerAccountsDailySettlementKpis({
  totalCash,
  totalUpi,
  totalExp,
  netSurplus,
  dateScopeLabel,
  formatCurrency,
  labels,
}: ManagerAccountsDailySettlementKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cash Collected */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {labels.cashCollected}
          </span>
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success border border-border flex items-center justify-center">
            <Coins size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-success font-mono">
              {formatCurrency(totalCash)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-success border border-border">
              [{dateScopeLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Physical cash drawer total ({dateScopeLabel})</p>
        </div>
      </div>

      {/* UPI Collected */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {labels.upiCollected}
          </span>
          <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary border border-border flex items-center justify-center">
            <QrCode size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary font-mono">
              {formatCurrency(totalUpi)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{dateScopeLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Direct bank / QR settlements ({dateScopeLabel})</p>
        </div>
      </div>

      {/* Expenses Disbursed */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {labels.expenses}
          </span>
          <div className="w-10 h-10 rounded-xl bg-danger-bg text-danger border border-border flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-danger font-mono">
              {formatCurrency(totalExp)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-danger border border-border">
              [{dateScopeLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Petty cash paid from counter ({dateScopeLabel})</p>
        </div>
      </div>

      {/* Net Shift Surplus */}
      <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            {labels.net}
          </span>
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning border border-border flex items-center justify-center">
            <Scale size={20} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary font-mono">
              {formatCurrency(netSurplus)}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{dateScopeLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Net realized vault closing balance ({dateScopeLabel})</p>
        </div>
      </div>
    </div>
  );
}

