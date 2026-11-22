// components/SuperadminIntegrationsOverviewEmptyState.tsx
// RESPONSIBILITY: Render empty state UI when no integration records match active filters.
// DATA FLOW: Props -> SuperadminIntegrationsOverviewEmptyState -> JSX.
'use client';

import { Cable, RotateCcw } from 'lucide-react';
import React from 'react';

interface SuperadminIntegrationsOverviewEmptyStateProps {
  title?: string;
  subtitle?: string;
  onResetFilters?: () => void;
}

export const SuperadminIntegrationsOverviewEmptyState: React.FC<SuperadminIntegrationsOverviewEmptyStateProps> = ({
  title = 'No Integrations Found',
  subtitle = 'No integration providers or records match the selected category or search filter.',
  onResetFilters,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-500/25 bg-gradient-to-br from-[#0c102b]/60 via-[#090d24]/60 to-[#050714]/60 p-12 text-center backdrop-blur-md"
      data-testid="superadmin-integrations-empty-state"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-4 shadow-inner">
        <Cable size={26} strokeWidth={2} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-100 tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">{subtitle}</p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 text-xs font-semibold text-white cursor-pointer transition-opacity min-w-32 justify-center shadow-md shadow-indigo-500/25"
        >
          <RotateCcw size={14} />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
