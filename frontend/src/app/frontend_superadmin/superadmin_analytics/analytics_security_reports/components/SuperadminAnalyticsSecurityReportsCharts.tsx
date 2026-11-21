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
      <div className="lg:col-span-2 p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Authentication & Threat Trajectory</h3>
            <p className="text-xs text-slate-400">Authorized login volume vs security threats and anomalies</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50" />
              Valid Logins
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-xs shadow-rose-400/50" />
              Failed / Threats
            </span>
          </div>
        </div>

        <div className="space-y-3.5 pt-2">
          {auditTrends.map((trend, i) => {
            const successPercent = Math.min(100, Math.round((trend.successfulLogins / maxLogins) * 100));
            const failPercent = Math.min(100, Math.round((trend.failedLogins / 100) * 100));

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{trend.period}</span>
                  <div className="flex gap-4 font-mono text-xs">
                    <span className="text-emerald-400 font-semibold">{formatSecurityNumber(trend.successfulLogins)} logins</span>
                    <span className="text-rose-400 font-medium">{trend.failedLogins} failed</span>
                    <span className="text-amber-400 font-bold">{trend.threatEvents} threats</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-900 border border-indigo-500/20 rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 shadow-xs shadow-emerald-500/30"
                    style={{ width: `${successPercent}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-500 shadow-xs shadow-rose-500/30"
                    style={{ width: `${failPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Threat Distribution Breakdown ── */}
      <div className="p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md flex flex-col justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Threat & Anomaly Distribution</h3>
          <p className="text-xs text-slate-400">Classification of detected security events</p>
        </div>

        <div className="space-y-4 my-auto pt-3">
          {threatDistribution.map((item, i) => {
            const isHigh = item.percentage >= 40;
            const barGradient = isHigh
              ? 'bg-gradient-to-r from-rose-600 to-rose-400'
              : 'bg-gradient-to-r from-amber-600 to-amber-400';
            const textColor = isHigh ? 'text-rose-400' : 'text-amber-400';

            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-white">{item.category}</span>
                  <span className={`font-bold font-mono ${textColor}`}>
                    {item.percentage}% ({item.count} events)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 border border-indigo-500/20 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full ${barGradient} rounded-full transition-all duration-500 shadow-xs`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-indigo-500/15 text-[11px] text-slate-400 flex items-center justify-between font-medium">
          <span>Real-time Sentinel Status</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Shield Active
          </span>
        </div>
      </div>
    </div>
  );
}
