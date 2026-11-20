// RESPONSIBILITY: Render empty state UI when no library matches filters.
import React from 'react';
import { Gauge, RotateCcw } from 'lucide-react';

interface SuperadminUsageOverviewEmptyStateProps {
  onReset: () => void;
}

export function SuperadminUsageOverviewEmptyState({ onReset }: SuperadminUsageOverviewEmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
        <Gauge className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white">No Library Quota Records Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          No registered library accounts match your search query or selected plan filter.
        </p>
      </div>
      <div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Filter Criteria
        </button>
      </div>
    </div>
  );
}
