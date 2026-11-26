'use client';
// RESPONSIBILITY: Render 6 financial KPI metric cards for Billing Reports with Cyber-Luxury styling.

import React from 'react';
import { IndianRupee, TrendingUp, Calendar, AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import type { BillingReportsKpiData } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/types/SuperadminAnalyticsBillingReportsTypes';
import { formatBillingCurrency } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/utils/SuperadminAnalyticsBillingReportsFormatters';

interface Props {
  kpis?: BillingReportsKpiData;
}

export function SuperadminAnalyticsBillingReportsKpiGrid({ kpis }: Props) {
  const data = kpis ?? {
    totalRevenueMinor: 0,
    mrrMinor: 0,
    yrrMinor: 0,
    pendingInvoicesCount: 0,
    pendingAmountMinor: 0,
    failedPaymentsCount: 0,
    failedAmountMinor: 0,
    refundsCount: 0,
    refundAmountMinor: 0,
    planWiseIncome: [],
  };

  const cards = [
    {
      title: 'Gross Platform Revenue',
      value: formatBillingCurrency(data.totalRevenueMinor),
      subtitle: 'Settled subscriptions',
      icon: IndianRupee,
      cardBg: 'bg-gradient-to-br from-[#061e14]/95 via-[#061810]/90 to-[#0a2e1d]/85 border-emerald-500/30 hover:border-emerald-400/50 shadow-emerald-950/40',
      iconStyle: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20',
      blurColor: 'bg-emerald-500/15',
      valueColor: 'text-emerald-300',
      badgeStyle: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
      dotColor: 'bg-emerald-400 motion-safe:animate-pulse',
    },
    {
      title: 'Monthly Recurring (MRR)',
      value: formatBillingCurrency(data.mrrMinor),
      subtitle: 'Predictable run rate',
      icon: TrendingUp,
      cardBg: 'bg-gradient-to-br from-[#0e0c28]/95 via-[#0a0920]/90 to-[#1a1444]/85 border-indigo-500/30 hover:border-indigo-400/50 shadow-indigo-950/40',
      iconStyle: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 shadow-indigo-500/20',
      blurColor: 'bg-indigo-500/15',
      valueColor: 'text-indigo-200',
      badgeStyle: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
      dotColor: 'bg-indigo-400',
    },
    {
      title: 'Yearly Recurring (YRR/ARR)',
      value: formatBillingCurrency(data.yrrMinor),
      subtitle: 'Annualized recurring income',
      icon: Calendar,
      cardBg: 'bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/85 border-sky-500/30 hover:border-sky-400/50 shadow-sky-950/40',
      iconStyle: 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sky-500/20',
      blurColor: 'bg-sky-500/15',
      valueColor: 'text-sky-200',
      badgeStyle: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
      dotColor: 'bg-sky-400',
    },
    {
      title: 'Pending Invoices',
      value: formatBillingCurrency(data.pendingAmountMinor),
      subtitle: `${data.pendingInvoicesCount} awaiting payment`,
      icon: AlertCircle,
      cardBg: 'bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/85 border-amber-500/30 hover:border-amber-400/50 shadow-amber-950/40',
      iconStyle: 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20',
      blurColor: 'bg-amber-500/15',
      valueColor: 'text-amber-300',
      badgeStyle: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
      dotColor: 'bg-amber-400',
    },
    {
      title: 'Failed Payments',
      value: formatBillingCurrency(data.failedAmountMinor),
      subtitle: `${data.failedPaymentsCount} transactions rejected`,
      icon: XCircle,
      cardBg: 'bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/85 border-rose-500/30 hover:border-rose-400/50 shadow-rose-950/40',
      iconStyle: 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/20',
      blurColor: 'bg-rose-500/15',
      valueColor: 'text-rose-300',
      badgeStyle: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
      dotColor: 'bg-rose-400 motion-safe:animate-pulse',
    },
    {
      title: 'Refunds Processed',
      value: formatBillingCurrency(data.refundAmountMinor),
      subtitle: `${data.refundsCount} chargeback/disputes`,
      icon: RotateCcw,
      cardBg: 'bg-gradient-to-br from-[#1a0a2a]/95 via-[#130722]/90 to-[#280d3f]/85 border-purple-500/30 hover:border-purple-400/50 shadow-purple-950/40',
      iconStyle: 'bg-purple-500/20 border-purple-500/40 text-purple-400 shadow-purple-500/20',
      blurColor: 'bg-purple-500/15',
      valueColor: 'text-purple-200',
      badgeStyle: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
      dotColor: 'bg-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`group relative overflow-hidden p-4 rounded-2xl border shadow-lg backdrop-blur-md flex flex-col justify-between motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] ${c.cardBg}`}
          >
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full blur-xl motion-safe:transition-all motion-safe:duration-500 group-hover:scale-125 ${c.blurColor}`} />
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md ${c.iconStyle}`}>
                <Icon size={16} strokeWidth={2.3} aria-hidden="true" />
              </div>
            </div>
            <div className="relative mt-2.5">
              <p className={`text-2xl font-black tracking-tight ${c.valueColor}`}>{c.value}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full px-2 py-0.5 border text-[11px] ${c.badgeStyle}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`} />
                  {c.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
