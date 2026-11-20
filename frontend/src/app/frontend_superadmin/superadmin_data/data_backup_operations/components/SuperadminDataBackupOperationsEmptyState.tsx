// components/SuperadminDataBackupOperationsEmptyState.tsx
// RESPONSIBILITY: Renders empty state when zero backup schedules exist. No API calls.
'use client';

import React from 'react';
import { CalendarClock, Plus } from 'lucide-react';

interface SuperadminDataBackupOperationsEmptyStateProps {
  onCreateSchedule: () => void;
}

export function SuperadminDataBackupOperationsEmptyState({
  onCreateSchedule,
}: SuperadminDataBackupOperationsEmptyStateProps) {
  return (
    <div
      className="p-12 text-center rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center space-y-4"
      data-testid="data_backup-empty-state"
    >
      <div className="p-4 rounded-full bg-pink-500/10 text-pink-400">
        <CalendarClock size={32} />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">No Automated Backup Schedules Configured</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">
          Automated schedules ensure continuous PostgreSQL WAL streaming and daily midnight snapshots so your RPO target (≤ 15 mins) is never compromised.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateSchedule}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span>Create First Backup Policy</span>
      </button>
    </div>
  );
}
