'use client';

import type { ManagerDashboardOverviewCashDrawerCardProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
import { formatManagerDashboardOverviewCurrency } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewCurrency';
import { AlertCircle, ArrowUpRight, CheckCircle2, QrCode, Wallet } from 'lucide-react';
import Link from 'next/link';

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
      className="mgr-cash-drawer-surface group relative overflow-hidden rounded-2xl border border-emerald-500/30 p-5 sm:p-6 shadow-lg shadow-emerald-950/20 motion-safe:transition-all flex flex-col justify-between h-full hover:border-emerald-400/50"
    >
      {/* Decorative background sparkline */}
      <svg aria-hidden="true" className="text-emerald-400 absolute bottom-0 right-0 w-36 h-20 opacity-15 group-hover:opacity-25 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
        <path d="M0,32 Q25,12 55,26 T105,10 T150,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Wallet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manager-cash-drawer-heading" className="text-base sm:text-lg font-bold text-white">
                  Today's Cash Drawer
                </h2>
                {timeRangeLabel && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    [{timeRangeLabel}]
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Register #1 • Counter Balance</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              settlementStatus === 'verified'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
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
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 shadow-xs">
            <div className="flex items-center justify-between text-emerald-300/80 mb-1">
              <span className="text-xs font-medium">Physical Cash</span>
              <Wallet size={14} className="text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {formatManagerDashboardOverviewCurrency(cashInDrawer)}
            </div>
            <p className="text-[11px] text-emerald-300/60 mt-0.5">In register drawer</p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 shadow-xs">
            <div className="flex items-center justify-between text-cyan-300/80 mb-1">
              <span className="text-xs font-medium">UPI & Online</span>
              <QrCode size={14} className="text-cyan-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {formatManagerDashboardOverviewCurrency(digitalCollections)}
            </div>
            <p className="text-[11px] text-cyan-300/60 mt-0.5">Instant gateway inflow</p>
          </div>
        </div>

        {/* Total Aggregate */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs mb-4">
          <span className="font-semibold text-amber-200/80">Total Inflow Recorded:</span>
          <span className="font-extrabold text-amber-400 text-sm">
            {formatManagerDashboardOverviewCurrency(totalCollections)}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
        <span className="text-xs text-slate-400">Register closing & cash handover</span>
        <Link
          href="/frontend_manager/manager_accounts_assets/accounts_daily_settlement"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 motion-safe:transition-all cursor-pointer shadow-xs"
        >
          <span>Open Daily Settlement</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </section>
  );
}

