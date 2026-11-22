// components/SuperadminDataOverviewEmptyState.tsx
// RESPONSIBILITY: Renders friendly empty state when no Disaster Recovery data is available. No API calls.
'use client';

import React from 'react';
import { Database, Plus } from 'lucide-react';

interface SuperadminDataOverviewEmptyStateProps {
  onTriggerBackup: () => void;
}

export function SuperadminDataOverviewEmptyState({ onTriggerBackup }: SuperadminDataOverviewEmptyStateProps) {
  return (
    <div
      className="p-12 text-center rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center space-y-4"
      data-testid="data_overview-empty-state"
    >
      <div className="p-4 rounded-full bg-pink-500/10 text-pink-400">
        <Database size={32} />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">No Disaster Recovery Metrics Available</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          The platform has not yet registered an initial backup or restore verification drill. Trigger your first encrypted snapshot to initialize DR telemetry.
        </p>
      </div>
      <button
        type="button"
        onClick={onTriggerBackup}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span>Create Initial Platform Snapshot</span>
      </button>
    </div>
  );
}
