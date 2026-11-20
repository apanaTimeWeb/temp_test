// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementSkeleton.tsx
'use client';

/**
 * @file SuperadminDataExportManagementSkeleton.tsx
 * @description Accessible loading skeleton for Data Export Management.
 */

import React from 'react';

export function SuperadminDataExportManagementSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading export management data"
      className="space-y-6 animate-pulse"
    >
      {/* Top 2 Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
          <div className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-5 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading export jobs queue...</span>
    </div>
  );
}
