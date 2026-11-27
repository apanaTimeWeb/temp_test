'use client';
// RESPONSIBILITY: Render usage trend telemetry and quota utilization progress bars.

import React from 'react';
import type { UsageTrendPoint, UsageConsumptionBreakdown } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/utils/SuperadminAnalyticsUsageReportsFormatters';

interface Props {
  usageTrends?: UsageTrendPoint[];
  consumptionBreakdown?: UsageConsumptionBreakdown[];
}

export function SuperadminAnalyticsUsageReportsCharts({
  usageTrends = [],
  consumptionBreakdown = [],
}: Props) {
  const maxApiCalls = Math.max(...usageTrends.map((t) => t.apiCalls), 1000000);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      data-testid="usage-reports-charts"
    >
      {/* ── API & Storage Ingress Velocity ── */}
      <div className="lg:col-span-2 p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">API & Data Ingress Trajectory</h3>
            <p className="text-xs text-slate-400">Monthly API calls and messaging volume expansion</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs shadow-sky-400/50" />
              API Requests
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-xs shadow-purple-400/50" />
              Messaging Volume
            </span>
          </div>
        </div>

        <div className="space-y-3.5 pt-2">
          {usageTrends.map((trend, i) => {
            const apiPercent = Math.min(100, Math.round((trend.apiCalls / maxApiCalls) * 100));
            const msgPercent = Math.min(100, Math.round((trend.messagingCount / 100000) * 100));

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{trend.period}</span>
                  <div className="flex gap-4 font-mono text-xs">
                    <span className="text-slate-300">{formatUsageNumber(trend.apiCalls)} calls</span>
                    <span className="text-purple-400 font-semibold">{formatUsageNumber(trend.messagingCount)} msgs</span>
                    <span className="text-sky-400 font-bold">{trend.storageGb} GB</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-900 border border-indigo-500/20 rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full motion-safe:transition-all motion-safe:duration-500 shadow-xs shadow-sky-500/30"
                    style={{ width: `${apiPercent}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full motion-safe:transition-all motion-safe:duration-500 shadow-xs shadow-purple-500/30"
                    style={{ width: `${msgPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Resource Quota Consumption Breakdown ── */}
      <div className="p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Platform Quota Consumption</h3>
          <p className="text-xs text-slate-400">Active capacity consumption vs plan ceilings</p>
        </div>

        <div className="space-y-4 my-auto pt-3">
          {consumptionBreakdown.map((item, i) => {
            const isHigh = item.percentage >= 80;
            const isMid = item.percentage >= 50;
            const barGradient = isHigh
              ? 'bg-gradient-to-r from-rose-600 to-rose-400'
              : isMid
              ? 'bg-gradient-to-r from-amber-600 to-amber-400'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-400';
            const textColor = isHigh ? 'text-rose-400' : isMid ? 'text-amber-400' : 'text-emerald-400';

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-white">{item.label}</span>
                  <span className={`font-bold font-mono ${textColor}`}>
                    {item.percentage}% ({formatUsageNumber(item.used)} / {formatUsageNumber(item.limit)} {item.unit})
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 border border-indigo-500/20 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full ${barGradient} rounded-full motion-safe:transition-all motion-safe:duration-500 shadow-xs`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-indigo-500/15 text-[11px] text-slate-400 flex items-center justify-between font-medium">
          <span>Tenant Auto-scaling Threshold</span>
          <span className="font-semibold text-emerald-400 font-mono">85% Capacity</span>
        </div>
      </div>
    </div>
  );
}
