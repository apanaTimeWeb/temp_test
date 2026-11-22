'use client';

import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/utils/SuperadminSubscriptionsActiveSubscribersFormatters';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';

export interface SuperadminSubscriptionsActiveSubscribersKpisProps {
  subs: readonly SuperadminSubscriptionRecord[];
  locale: string;
}

export function SuperadminSubscriptionsActiveSubscribersKpis({
  subs,
  locale,
}: SuperadminSubscriptionsActiveSubscribersKpisProps) {
  const totalMrr = subs.reduce((acc, row) => acc + (typeof row.mrr === 'number' ? row.mrr : 0), 0);
  const paidCount = subs.filter((row) => row.status === 'Paid').length;
  const dueCount = subs.filter((row) => row.status === 'Due Soon').length;
  const overdueCount = subs.filter((row) => row.status === 'Overdue').length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1 */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Pipeline MRR</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
          {formatSuperadminSubscriptionsMajorPreviewCurrency(totalMrr, 'INR', locale)}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
            Recurring Active
          </span>
          <span className="text-[11px] text-slate-400">100% Verified</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '82%' }} />
        </div>
      </div>

      {/* KPI 2 */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Paid Subscribers</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
          {paidCount}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
            {Math.round((paidCount / Math.max(1, subs.length)) * 100)}% Current
          </span>
          <span className="text-[11px] text-slate-400">Healthy</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '75%' }} />
        </div>
      </div>

      {/* KPI 3 */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Due Soon</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
          {dueCount}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/20">
            Payment Pending
          </span>
          <span className="text-[11px] text-slate-400">7 Days</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: '30%' }} />
        </div>
      </div>

      {/* KPI 4 */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Overdue / Suspended</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
          {overdueCount}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
            Action Required
          </span>
          <span className="text-[11px] text-slate-400">Grace Expired</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '15%' }} />
        </div>
      </div>
    </div>
  );
}
export default SuperadminSubscriptionsActiveSubscribersKpis;
