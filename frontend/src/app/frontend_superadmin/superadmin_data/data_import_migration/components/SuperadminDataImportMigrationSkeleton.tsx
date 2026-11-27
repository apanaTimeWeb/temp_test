// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationSkeleton.tsx
'use client';

/**
 * @file SuperadminDataImportMigrationSkeleton.tsx
 * @description Accessible loading skeleton for Data Import & Migration Management.
 */

import React from 'react';

export function SuperadminDataImportMigrationSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading migration data"
      className="space-y-6 motion-safe:animate-pulse"
    >
      {/* Wizard Skeleton */}
      <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="h-5 w-60 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
      </div>

      {/* History Table Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading migration records...</span>
    </div>
  );
}
