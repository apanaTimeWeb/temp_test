'use client';
// RESPONSIBILITY: Display placeholder when security audit logs or events have 0 matches.

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function SuperadminAnalyticsSecurityReportsEmptyState() {
  return (
    <div
      className="p-12 text-center rounded-2xl border border-dashed border-indigo-500/30 bg-[#0a0d24]/60 backdrop-blur-md space-y-3 shadow-xl"
      data-testid="security-reports-empty-state"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
        <ShieldCheck size={26} />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">No Security Events Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        No login attempts, lockout incidents, or threat anomalies match the selected query criteria.
        Try adjusting your search keywords or filter criteria.
      </p>
    </div>
  );
}
