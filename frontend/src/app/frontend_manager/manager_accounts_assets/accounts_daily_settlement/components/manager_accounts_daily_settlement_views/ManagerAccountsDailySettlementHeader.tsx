'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { Coins, Download, Printer, RefreshCw } from 'lucide-react';

interface ManagerAccountsDailySettlementHeaderProps {
  title: string;
  subtitle: string;
  filteredCount: number;
  dateScopeLabel: string;
  isSyncing: boolean;
  onSyncBalances: () => void;
  onExportCsv: () => void;
  onOpenDenomination: () => void;
}

export function ManagerAccountsDailySettlementHeader({
  title,
  subtitle,
  filteredCount,
  dateScopeLabel,
  isSyncing,
  onSyncBalances,
  onExportCsv,
  onOpenDenomination,
}: ManagerAccountsDailySettlementHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">{title}</h1>
            <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
              {filteredCount} Shifts • Scope: {dateScopeLabel}
            </span>
          </div>
          <p className="text-sm text-secondary">
            {subtitle} • Date: {dateScopeLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto shrink-0 max-w-full py-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            title="Print Daily Settlement Report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={onSyncBalances}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60 whitespace-nowrap shrink-0"
            title="Sync Drawer Balances"
          >
            {isSyncing ? <ButtonLoader icon="scale" /> : <RefreshCw size={14} />}
            <span>{isSyncing ? 'Syncing...' : 'Sync Balances'}</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            title="Export Daily Settlement as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenDenomination}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow-emerald-500/25 motion-safe:transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Currency Denomination Counter & Owner Handover Receipt"
          >
            <Coins size={14} />
            <span>Denomination & Owner Handover</span>
          </button>
        </div>
      </div>
    </div>
  );
}
