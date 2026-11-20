'use client';
// RESPONSIBILITY: Render financial collection trends and plan-wise income breakdown.

import React from 'react';
import type { BillingRevenueTrendPoint, PlanWiseIncomeItem } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { formatBillingCurrency } from '../utils/SuperadminAnalyticsBillingReportsFormatters';

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
      <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card/60 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Revenue Collection & Outstanding Trend</h3>
            <p className="text-xs text-muted-foreground">Monthly cash collected vs pending receivables</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Collected</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
          </div>
        </div>

        <div className="h-52 flex items-end gap-2 sm:gap-4 pt-4 border-b border-border/40 pb-2">
          {revenueTrend.map((point) => (
            <div key={point.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full flex justify-center items-end gap-1 h-full">
                <div
                  style={{ height: `${(point.collectedMinor / maxCollected) * 100}%` }}
                  className="w-3 sm:w-5 rounded-t-sm bg-emerald-500/80 group-hover:bg-emerald-400 transition-all"
                  title={`Collected: ${formatBillingCurrency(point.collectedMinor)}`}
                />
                <div
                  style={{ height: `${(point.pendingMinor / maxCollected) * 100}%` }}
                  className="w-3 sm:w-5 rounded-t-sm bg-amber-500/80 group-hover:bg-amber-400 transition-all"
                  title={`Pending: ${formatBillingCurrency(point.pendingMinor)}`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {point.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Plan-Wise Income Breakdown */}
      <div className="p-5 rounded-2xl border border-border bg-card/60 flex flex-col justify-between shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-foreground">Plan-Wise Income Breakdown</h3>
          <p className="text-xs text-muted-foreground">Revenue contribution per subscription tier</p>
        </div>

        <div className="my-3 space-y-3">
          {planWiseIncome.map((tier) => (
            <div key={tier.planName} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">{tier.planName}</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {formatBillingCurrency(tier.revenueMinor)} ({tier.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${tier.percentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{tier.subscriberCount} active subscribers</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground border-t border-border/40 pt-2 text-center">
          Enterprise Elite accounts generate 45.5% of SaaS revenue
        </p>
      </div>
    </div>
  );
}
