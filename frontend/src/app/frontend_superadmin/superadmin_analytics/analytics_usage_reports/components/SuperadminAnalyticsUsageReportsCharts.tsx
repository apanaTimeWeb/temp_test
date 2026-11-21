'use client';
// RESPONSIBILITY: Render usage trend telemetry and quota utilization progress bars.

import React from 'react';
import type { UsageTrendPoint, UsageConsumptionBreakdown } from '../types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber } from '../utils/SuperadminAnalyticsUsageReportsFormatters';

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
      <div className="lg:col-span-2 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">API & Data Ingress Trajectory</h3>
            <p className="text-xs text-muted-foreground">Monthly API calls and data volume growth</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
              API Requests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
              Messaging Volume
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {usageTrends.map((trend, i) => {
            const apiPercent = Math.min(100, Math.round((trend.apiCalls / maxApiCalls) * 100));
            const msgPercent = Math.min(100, Math.round((trend.messagingCount / 100000) * 100));

            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{trend.period}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    <span>{formatUsageNumber(trend.apiCalls)} calls</span>
                    <span className="text-purple-400">{formatUsageNumber(trend.messagingCount)} msgs</span>
                    <span className="font-mono text-xs text-sky-400">{trend.storageGb} GB</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex gap-1">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${apiPercent}%` }}
                  />
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${msgPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Resource Quota Consumption Breakdown ── */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Platform Quota Consumption</h3>
          <p className="text-xs text-muted-foreground">Active capacity consumption vs plan ceilings</p>
        </div>

        <div className="space-y-4 my-auto pt-3">
          {consumptionBreakdown.map((item, i) => {
            const isHigh = item.percentage >= 80;
            const isMid = item.percentage >= 50;
            const barColor = isHigh ? 'bg-rose-500' : isMid ? 'bg-amber-500' : 'bg-emerald-500';
            const textColor = isHigh ? 'text-rose-400' : isMid ? 'text-amber-400' : 'text-emerald-400';

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className={`font-bold ${textColor}`}>
                    {item.percentage}% ({formatUsageNumber(item.used)} / {formatUsageNumber(item.limit)} {item.unit})
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Tenant Auto-scaling Threshold</span>
          <span className="font-semibold text-foreground">85% Capacity</span>
        </div>
      </div>
    </div>
  );
}
