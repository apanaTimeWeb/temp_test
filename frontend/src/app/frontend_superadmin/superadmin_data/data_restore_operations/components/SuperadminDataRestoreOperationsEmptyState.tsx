// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsEmptyState.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsEmptyState.tsx
 * @description Clean empty state displayed when no backup snapshots match filters.
 */

import React from 'react';
import { Database, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function SuperadminDataRestoreOperationsEmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
      <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-3">
        <Database className="w-8 h-8" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        No Backup Snapshots Found
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        No snapshot records match your current filter parameters or search query.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reset Filter Criteria
      </button>
    </div>
  );
}
