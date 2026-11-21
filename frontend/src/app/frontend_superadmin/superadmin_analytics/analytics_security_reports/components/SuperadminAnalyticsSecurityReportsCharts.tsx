'use client';
// RESPONSIBILITY: Render security audit trend telemetry and threat category distribution.

import React from 'react';
import type { SecurityAuditTrendPoint, SecurityThreatDistributionItem } from '../types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityNumber } from '../utils/SuperadminAnalyticsSecurityReportsFormatters';

interface Props {
  auditTrends?: SecurityAuditTrendPoint[];
  threatDistribution?: SecurityThreatDistributionItem[];
}

export function SuperadminAnalyticsSecurityReportsCharts({
  auditTrends = [],
  threatDistribution = [],
}: Props) {
  const maxLogins = Math.max(...auditTrends.map((t) => t.successfulLogins), 1000);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      data-testid="security-reports-charts"
    >
      {/* ── Daily Authentication Telemetry ── */}
      <div className="lg:col-span-2 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Authentication & Threat Trajectory</h3>
            <p className="text-xs text-muted-foreground">Authorized access vs blocked brute-force events</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              Valid Logins
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              Failed / Threats
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {auditTrends.map((trend, i) => {
            const successPercent = Math.min(100, Math.round((trend.successfulLogins / maxLogins) * 100));
            const failPercent = Math.min(100, Math.round((trend.failedLogins / 100) * 100));

            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{trend.period}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="text-emerald-400 font-medium">{formatSecurityNumber(trend.successfulLogins)} logins</span>
                    <span className="text-rose-400 font-medium">{trend.failedLogins} failed</span>
                    <span className="font-mono text-xs text-amber-400">{trend.threatEvents} threats</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex gap-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${successPercent}%` }}
                  />
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${failPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Threat Distribution Breakdown ── */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Threat & Anomaly Distribution</h3>
          <p className="text-xs text-muted-foreground">Classification of detected security events</p>
        </div>

        <div className="space-y-4 my-auto pt-3">
          {threatDistribution.map((item, i) => {
            const isHigh = item.percentage >= 40;
            const barColor = isHigh ? 'bg-rose-500' : 'bg-amber-500';

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">{item.category}</span>
                  <span className="font-bold text-foreground">
                    {item.percentage}% ({item.count} events)
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
          <span>Real-time Sentinel Status</span>
          <span className="font-semibold text-emerald-400">Shield Active</span>
        </div>
      </div>
    </div>
  );
}
