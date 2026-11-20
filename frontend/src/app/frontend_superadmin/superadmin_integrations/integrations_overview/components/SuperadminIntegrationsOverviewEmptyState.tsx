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
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/60 p-12 text-center"
      data-testid="superadmin-integrations-empty-state"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-bg text-purple-text mb-4 shadow-xs">
        <Cable size={26} strokeWidth={2} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90 cursor-pointer transition-opacity min-w-32 justify-center shadow-xs"
        >
          <RotateCcw size={14} />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
