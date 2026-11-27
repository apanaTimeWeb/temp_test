import React from 'react';

export default function SuperadminBranchesOverviewListSkeleton() {
  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12 motion-safe:animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-surface-elevated rounded-lg" />
          <div className="h-4 w-72 bg-surface-elevated rounded-md" />
        </div>
        <div className="h-10 w-36 bg-surface-elevated rounded-xl" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`kpi-skel-${idx}`} className="h-24 rounded-2xl border border-border bg-card p-4 space-y-2">
            <div className="h-3 w-20 bg-surface-elevated rounded" />
            <div className="h-7 w-16 bg-surface-elevated rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="h-10 w-full bg-surface-elevated rounded-xl" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={`row-skel-${idx}`} className="h-14 w-full bg-surface-elevated rounded-xl" />
        ))}
      </div>
    </div>
  );
}
