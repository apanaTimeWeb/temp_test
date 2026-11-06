'use client';

import Link from 'next/link';
import { Wallet, QrCode, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ManagerDashboardOverviewCashDrawerCardProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';

export function ManagerDashboardOverviewCashDrawerCard({
  cashInDrawer = 4200,
  digitalCollections = 18500,
  totalCollections = 22700,
  settlementStatus = 'pending',
  timeRangeLabel,
}: ManagerDashboardOverviewCashDrawerCardProps) {
  return (
    <section
      aria-labelledby="manager-cash-drawer-heading"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between h-full"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-bg border border-border text-success flex items-center justify-center font-bold shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manager-cash-drawer-heading" className="text-base sm:text-lg font-bold text-foreground">
                  Today's Cash Drawer
                </h2>
                {timeRangeLabel && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{timeRangeLabel}]
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Register #1 • Counter Balance</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              settlementStatus === 'verified'
                ? 'bg-success-bg text-success border-border'
                : 'bg-warning-bg text-warning-text border-border'
            }`}
          >
            {settlementStatus === 'verified' ? (
              <>
                <CheckCircle2 size={13} />
                <span>Reconciled</span>
              </>
            ) : (
              <>
                <AlertCircle size={13} />
                <span>Pending Handover</span>
              </>
            )}
          </span>
        </div>

        {/* Counter Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-surface-highlight border border-border">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Physical Cash</span>
              <Wallet size={14} className="text-success" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              ₹{cashInDrawer.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">In register drawer</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-highlight border border-border">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">UPI & Online</span>
              <QrCode size={14} className="text-info" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              ₹{digitalCollections.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Instant gateway inflow</p>
          </div>
        </div>

        {/* Total Aggregate */}
        <div className="p-3 rounded-xl bg-muted border border-border flex items-center justify-between text-xs mb-4">
          <span className="font-semibold text-muted-foreground">Total Inflow Recorded:</span>
          <span className="font-extrabold text-foreground text-sm">
            ₹{totalCollections.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
        <Link
          href="/frontend_manager/manager_accounts_assets/accounts_daily_settlement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
        >
          <span>Open Daily Settlement</span>
          <ArrowUpRight size={13} />
        </Link>

        <Link
          href="/frontend_manager/manager_finance/finance_collect_fee"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
        >
          <span>+ Collect Fee</span>
        </Link>
      </div>
    </section>
  );
}

