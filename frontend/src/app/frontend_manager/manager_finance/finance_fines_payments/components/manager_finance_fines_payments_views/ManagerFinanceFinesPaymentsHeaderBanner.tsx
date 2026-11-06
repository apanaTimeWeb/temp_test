'use client';

import React from 'react';
import { DollarSign, RefreshCw, Receipt } from 'lucide-react';

export interface ManagerFinanceFinesPaymentsHeaderBannerProps {
  receiptsCount: number;
  timeHorizonLabel: string;
  isSyncing: boolean;
  onSyncLedger: () => void;
  onViewReceipts: () => void;
  financeLabel: string;
  finesPaymentsTitle: string;
  scopeDescription: string;
  warningNotice: string;
}

export default function ManagerFinanceFinesPaymentsHeaderBanner({
  receiptsCount,
  timeHorizonLabel,
  isSyncing,
  onSyncLedger,
  onViewReceipts,
  financeLabel,
  finesPaymentsTitle,
  scopeDescription,
  warningNotice,
}: ManagerFinanceFinesPaymentsHeaderBannerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-primary uppercase tracking-wider">{financeLabel}</span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-success-bg text-success border border-border">
              <DollarSign size={12} />
              Financial Treasury & Fines
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-muted text-secondary border border-border">
              📍 Central Branch
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary flex items-center gap-2.5">
              <span>{finesPaymentsTitle}</span>
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-md bg-primary-subtle text-primary font-bold">
              {receiptsCount} Receipts • Scope: {timeHorizonLabel}
            </span>
          </div>

          <p className="text-sm text-secondary">
            {scopeDescription} • Scope: {timeHorizonLabel}
          </p>
        </div>

        {/* Header Fast Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:self-start lg:self-center">
          <button
            type="button"
            onClick={onSyncLedger}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm active:scale-95 disabled:opacity-60"
            title="Sync Financial Ledger"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin text-primary' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Ledger'}</span>
          </button>

          <button
            type="button"
            onClick={onViewReceipts}
            className="mgr-btn-primary min-h-11 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 text-sm font-semibold"
          >
            <Receipt size={16} />
            <span>View Receipts Ledger</span>
          </button>
        </div>
      </div>

      {/* Warning notification banner */}
      <p
        className="mt-4 rounded-xl border border-border bg-warning-bg p-3 text-xs text-warning leading-relaxed"
        data-testid="manager-finance-fines-sample-warning"
        role="status"
      >
        {warningNotice}
      </p>
    </div>
  );
}

