// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSkeleton.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsSkeleton.tsx
 * @description Accessible loading skeleton for the Restore Operations view.
 */

import React from 'react';

export function SuperadminDataRestoreOperationsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading restore operations data"
      className="space-y-6 motion-safe:animate-pulse"
    >
      {/* Banner Skeleton */}
      <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />

      {/* Drill Card Skeleton */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-96 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
          <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Snapshots Table Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading restore operations catalog...</span>
    </div>
  );
}
