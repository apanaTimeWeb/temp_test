'use client';
// RESPONSIBILITY: Render empty state fallback when no usage records match active filters.

import React from 'react';
import { Gauge } from 'lucide-react';

export function SuperadminAnalyticsUsageReportsEmptyState() {
  return (
    <div
      className="p-10 rounded-2xl border border-dashed border-indigo-500/30 bg-[#0a0d24]/60 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-3 shadow-xl"
      data-testid="usage-reports-empty-state"
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <Gauge size={26} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">No Usage Records Found</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          No library accounts or branches match your selected filters. Try broadening the search criteria or resetting filters.
        </p>
      </div>
    </div>
  );
}
