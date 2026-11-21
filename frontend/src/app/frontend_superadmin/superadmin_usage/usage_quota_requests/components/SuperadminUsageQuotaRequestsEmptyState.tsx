// components/SuperadminUsageQuotaRequestsEmptyState.tsx
// RESPONSIBILITY: Render empty state when no quota requests match the active filters.
import React from 'react';
import { GitBranch, RotateCcw } from 'lucide-react';

interface SuperadminUsageQuotaRequestsEmptyStateProps {
  onReset?: () => void;
}

export function SuperadminUsageQuotaRequestsEmptyState({
  onReset,
}: SuperadminUsageQuotaRequestsEmptyStateProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-xl space-y-3">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <GitBranch className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white">No Quota Upgrade Requests Found</h3>
      <p className="mx-auto max-w-sm text-xs text-slate-400 leading-relaxed">
        No pending or historical branch expansion or resource quota requests match your active search and filter criteria.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );
}
