'use client';
// RESPONSIBILITY: Render 6 financial KPI metric cards for Billing Reports.

import React from 'react';
import { IndianRupee, TrendingUp, Calendar, AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import type { BillingReportsKpiData } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { formatBillingCurrency } from '../utils/SuperadminAnalyticsBillingReportsFormatters';

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
      subtitle: 'Total settled subscriptions',
      icon: IndianRupee,
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Monthly Recurring (MRR)',
      value: formatBillingCurrency(data.mrrMinor),
      subtitle: 'Predictable monthly run rate',
      icon: TrendingUp,
      colorText: 'text-indigo-400',
      colorBg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Yearly Recurring (YRR/ARR)',
      value: formatBillingCurrency(data.yrrMinor),
      subtitle: 'Annualized recurring income',
      icon: Calendar,
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Pending Invoices',
      value: formatBillingCurrency(data.pendingAmountMinor),
      subtitle: `${data.pendingInvoicesCount} awaiting payment`,
      icon: AlertCircle,
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Failed Payments',
      value: formatBillingCurrency(data.failedAmountMinor),
      subtitle: `${data.failedPaymentsCount} transactions rejected`,
      icon: XCircle,
      colorText: 'text-rose-400',
      colorBg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Refunds Processed',
      value: formatBillingCurrency(data.refundAmountMinor),
      subtitle: `${data.refundsCount} chargeback/disputes`,
      icon: RotateCcw,
      colorText: 'text-violet-400',
      colorBg: 'bg-violet-500/10 border-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`p-4 rounded-2xl border ${c.colorBg} bg-card/60 backdrop-blur-xs flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xs`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
              <div className={`p-1.5 rounded-lg ${c.colorText} bg-background/50`}>
                <Icon size={16} aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
