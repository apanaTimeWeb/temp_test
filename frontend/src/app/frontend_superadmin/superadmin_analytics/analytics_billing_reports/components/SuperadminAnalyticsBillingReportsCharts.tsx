'use client';
// RESPONSIBILITY: Render financial collection trends and plan-wise income breakdown.

import React from 'react';
import type { BillingRevenueTrendPoint, PlanWiseIncomeItem } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/types/SuperadminAnalyticsBillingReportsTypes';
import { formatBillingCurrency } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/utils/SuperadminAnalyticsBillingReportsFormatters';

interface Props {
  revenueTrend?: BillingRevenueTrendPoint[];
  planWiseIncome?: PlanWiseIncomeItem[];
}

export function SuperadminAnalyticsBillingReportsCharts({
  revenueTrend = [],
  planWiseIncome = [],
}: Props) {
  const maxCollected = Math.max(...revenueTrend.map((p) => p.collectedMinor), 10000000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Monthly Revenue Collection Trend */}
      <div className="lg:col-span-2 p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Revenue Collection & Outstanding Trend</h3>
            <p className="text-xs text-slate-400">Monthly cash collected vs pending receivables</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
              Collected
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
              Pending
            </span>
          </div>
        </div>

        <div className="h-52 flex items-end gap-2 sm:gap-4 pt-4 border-b border-indigo-500/15 pb-2">
          {revenueTrend.map((point) => (
            <div key={point.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full flex justify-center items-end gap-1.5 h-full">
                <div
                  style={{ height: `${(point.collectedMinor / maxCollected) * 100}%` }}
                  className="w-3 sm:w-5 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125 motion-safe:transition-all shadow-xs shadow-emerald-500/30"
                  title={`Collected: ${formatBillingCurrency(point.collectedMinor)}`}
                />
                <div
                  style={{ height: `${(point.pendingMinor / maxCollected) * 100}%` }}
                  className="w-3 sm:w-5 rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-125 motion-safe:transition-all shadow-xs shadow-amber-500/30"
                  title={`Pending: ${formatBillingCurrency(point.pendingMinor)}`}
                />
              </div>
              <span className="text-[10px] text-slate-400 truncate w-full text-center font-mono">
                {point.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Plan-Wise Income Breakdown */}
      <div className="p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Plan-Wise Income Breakdown</h3>
          <p className="text-xs text-slate-400">Revenue contribution per subscription tier</p>
        </div>

        <div className="my-3 space-y-3">
          {planWiseIncome.map((tier) => (
            <div key={tier.planName} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white">{tier.planName}</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {formatBillingCurrency(tier.revenueMinor)} ({tier.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 border border-indigo-500/20 overflow-hidden">
                <div
                  style={{ width: `${tier.percentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 motion-safe:transition-all motion-safe:duration-500 shadow-xs"
                />
              </div>
              <p className="text-[10px] text-slate-400">{tier.subscriberCount} active subscribers</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 border-t border-indigo-500/15 pt-2 text-center font-medium">
          Enterprise Elite accounts generate 45.5% of total SaaS revenue
        </p>
      </div>
    </div>
  );
}
