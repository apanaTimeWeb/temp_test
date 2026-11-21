'use client';
// RESPONSIBILITY: Render empty state fallback when no usage records match active filters.

import React from 'react';
import { Gauge, RotateCcw } from 'lucide-react';

export function SuperadminAnalyticsUsageReportsEmptyState() {
  return (
    <div
      className="p-10 rounded-2xl border border-dashed border-border/80 bg-card/40 text-center flex flex-col items-center justify-center space-y-3"
      data-testid="usage-reports-empty-state"
    >
      <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
        <Gauge size={22} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">No Usage Records Found</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          No library accounts or branches match your selected filters. Try broadening the search criteria or resetting filters.
        </p>
      </div>
    </div>
  );
}
