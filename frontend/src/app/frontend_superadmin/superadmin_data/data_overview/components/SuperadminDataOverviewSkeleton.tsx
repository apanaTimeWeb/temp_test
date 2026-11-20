// components/SuperadminDataOverviewSkeleton.tsx
// RESPONSIBILITY: Renders skeleton placeholder layout mimicking final UI to stabilize CLS (<0.1). No API calls.
'use client';

import React from 'react';

export function SuperadminDataOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="data_overview-skeleton">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2 border-b border-border">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-neutral-800 rounded-md" />
          <div className="h-4 w-96 bg-neutral-800/60 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 bg-neutral-800 rounded-lg" />
          <div className="h-9 w-36 bg-neutral-800 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <div className="h-4 w-24 bg-neutral-800 rounded" />
            <div className="h-8 w-32 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>

      {/* RPO / RTO Gauges Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-56 rounded-xl border border-border bg-card/60 p-5 space-y-4">
          <div className="h-5 w-48 bg-neutral-800 rounded" />
          <div className="h-20 w-full bg-neutral-800/40 rounded" />
        </div>
        <div className="h-56 rounded-xl border border-border bg-card/60 p-5 space-y-4">
          <div className="h-5 w-48 bg-neutral-800 rounded" />
          <div className="h-20 w-full bg-neutral-800/40 rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="h-64 rounded-xl border border-border bg-card/60 p-4 space-y-3">
        <div className="h-5 w-40 bg-neutral-800 rounded" />
        <div className="h-48 w-full bg-neutral-800/30 rounded" />
      </div>
    </div>
  );
}
