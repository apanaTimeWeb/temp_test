// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionSkeleton.tsx
'use client';

/**
 * @file SuperadminDataArchiveRetentionSkeleton.tsx
 * @description Accessible loading skeleton for Data Archive & Retention Rules.
 */

import React from 'react';

export function SuperadminDataArchiveRetentionSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading retention rules and archive catalog"
      className="space-y-6 motion-safe:animate-pulse"
    >
      {/* Rules Table Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Archive Catalog Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between">
          <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-48 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading retention rules and archive catalog...</span>
    </div>
  );
}
