'use client';
// RESPONSIBILITY: Visual analytics charts for platform growth and status distributions.

import React from 'react';
import type { PlatformGrowthTimelinePoint, PlatformStatusDistributionPoint } from '../types/SuperadminAnalyticsPlatformReportsTypes';
import { PLATFORM_STATUS_COLORS } from '../constants/SuperadminAnalyticsPlatformReportsConstants';

interface Props {
  growthTimeline?: PlatformGrowthTimelinePoint[];
  statusDistribution?: PlatformStatusDistributionPoint[];
}

export function SuperadminAnalyticsPlatformReportsCharts({
  growthTimeline = [],
  statusDistribution = [],
}: Props) {
  const maxActive = Math.max(...growthTimeline.map((p) => p.activeTotal), 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Growth Timeline Bar Chart */}
      <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-primary">Platform Expansion & Growth Timeline</h3>
            <p className="text-xs text-secondary">Monthly net-new libraries, branches & active totals</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> New Libs</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-info" /> Branches</span>
          </div>
        </div>

        <div className="h-52 flex items-end gap-2 sm:gap-4 pt-4 border-b border-border pb-2">
          {growthTimeline.map((point) => {
            const heightPercent = Math.min(100, Math.max(15, (point.activeTotal / maxActive) * 100));
            return (
              <div key={point.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex justify-center items-end gap-1 h-full">
                  <div
                    style={{ height: `${(point.newLibraries / 100) * 100}%` }}
                    className="w-3 sm:w-4 rounded-t-sm bg-primary motion-safe:transition-all"
                    title={`New Libraries: ${point.newLibraries}`}
                  />
                  <div
                    style={{ height: `${(point.newBranches / 250) * 100}%` }}
                    className="w-3 sm:w-4 rounded-t-sm bg-info motion-safe:transition-all"
                    title={`New Branches: ${point.newBranches}`}
                  />
                </div>
                <span className="text-[10px] text-secondary truncate w-full text-center">
                  {point.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Status Distribution */}
      <div className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between shadow-card">
        <div>
          <h3 className="text-sm font-bold text-primary">Account Status Distribution</h3>
          <p className="text-xs text-secondary">Active vs Risk vs Inactive percentages</p>
        </div>

        <div className="my-4 space-y-3">
          {statusDistribution.map((item) => {
            const colorCfg = PLATFORM_STATUS_COLORS[item.status] ?? { bg: 'bg-muted', text: 'text-foreground' };
            return (
              <div key={item.status} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${colorCfg.text}`}>{item.status}</span>
                  <span className="text-slate-400 font-mono">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-900 border border-indigo-500/20 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className={`h-full rounded-full ${item.status === 'ACTIVE' ? 'bg-emerald-400' : item.status === 'SUSPENDED' ? 'bg-amber-400' : item.status === 'CHURNED' ? 'bg-rose-400' : 'bg-slate-400'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 border-t border-indigo-500/20 pt-2 text-center">
          94.5% overall health score across SaaS tenants
        </p>
      </div>
    </div>
  );
}
