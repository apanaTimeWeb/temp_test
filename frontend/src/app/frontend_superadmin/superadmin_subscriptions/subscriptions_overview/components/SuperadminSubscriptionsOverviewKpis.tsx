'use client';

import { TrendingUp, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewFormatters';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';

interface SuperadminSubscriptionsOverviewKpisProps {
  subscribers: SuperadminSubscriptionRecord[];
  locale: string;
}

export default function SuperadminSubscriptionsOverviewKpis({
  subscribers,
  locale,
}: SuperadminSubscriptionsOverviewKpisProps) {
  const totalMrr = subscribers.reduce((acc, row) => acc + (typeof row.mrr === 'number' ? row.mrr : 0), 0);
  const activeCount = subscribers.filter((r) => r.status === 'Active' || r.status === 'Paid').length;
  const graceCount = subscribers.filter((r) => r.status === 'Grace Period' || r.status === 'Due Soon' || r.status === 'Past Due').length;
  const suspendedCount = subscribers.filter((r) => r.status === 'Suspended' || r.status === 'Cancelled' || r.status === 'Expired').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Total MRR */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Monthly MRR</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
          {formatSuperadminSubscriptionsMajorPreviewCurrency(totalMrr, 'INR', locale)}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
            Active Billing
          </span>
          <span className="text-[11px] text-slate-400">Recurring SaaS</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '88%' }} />
        </div>
      </div>

      {/* KPI 2: Active Good Standing */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Active Paid Tenants</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{activeCount}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
            {Math.round((activeCount / Math.max(1, subscribers.length)) * 100)}% Good Standing
          </span>
          <span className="text-[11px] text-slate-400">Operational</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '75%' }} />
        </div>
      </div>

      {/* KPI 3: Grace Period / Due Soon */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Grace Period / Due</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{graceCount}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/20">
            7-Day Safety Buffer
          </span>
          <span className="text-[11px] text-slate-400">No Data Loss</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: '40%' }} />
        </div>
      </div>

      {/* KPI 4: Restricted / Suspended */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Restricted / Suspended</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{suspendedCount}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
            <ShieldCheck size={11} className="text-emerald-400 inline" /> Read-Only Retained
          </span>
          <span className="text-[11px] text-slate-400">Export Allowed</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '25%' }} />
        </div>
      </div>
    </div>
  );
}
