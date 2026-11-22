'use client';
// RESPONSIBILITY: Render top Hero Header card for SaaS Subscriptions Overview (< 100 lines).
import { CreditCard, ShieldCheck, Plus } from 'lucide-react';

interface SuperadminSubscriptionsOverviewHeaderProps {
  title: string;
  tenantsCount: number;
  onNewSubscription: () => void;
}

export default function SuperadminSubscriptionsOverviewHeader({
  title,
  tenantsCount,
  onNewSubscription,
}: SuperadminSubscriptionsOverviewHeaderProps) {
  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {title}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                SaaS Lifecycle Active
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                <ShieldCheck size={12} className="text-indigo-400" />
                {tenantsCount} Tenants
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              SaaS tenant subscription lifecycle, tier upgrades, renewals, grace period & audit history.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewSubscription}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>New Subscription</span>
        </button>
      </div>
    </div>
  );
}
