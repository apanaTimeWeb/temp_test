// components/SuperadminIntegrationsOverviewListSkeleton.tsx
// RESPONSIBILITY: Display premium pulse skeleton matching actual layout while data is loading.
// DATA FLOW: Stateless UI skeleton.
'use client';

import React from 'react';

export const SuperadminIntegrationsOverviewListSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-pulse"
      data-testid="superadmin-integrations-skeleton"
      aria-label="Loading integrations hub..."
    >
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-skeleton-base" />
          <div className="space-y-2">
            <div className="h-5 w-56 rounded-md bg-skeleton-base" />
            <div className="h-3.5 w-80 rounded-md bg-skeleton-highlight" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 rounded-lg bg-skeleton-base" />
          <div className="h-8 w-24 rounded-lg bg-skeleton-base" />
        </div>
      </div>

      {/* KPI Cards Row Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/70 bg-card p-4 space-y-2.5">
            <div className="h-3 w-20 rounded bg-skeleton-highlight" />
            <div className="h-6 w-14 rounded-md bg-skeleton-base" />
          </div>
        ))}
      </div>

      {/* Filter bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="h-9 w-full sm:w-80 rounded-xl bg-skeleton-base" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-24 rounded-lg bg-skeleton-highlight" />
          ))}
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-skeleton-base" />
                <div className="h-3 w-24 rounded bg-skeleton-highlight" />
              </div>
              <div className="h-5 w-16 rounded-full bg-skeleton-highlight" />
            </div>
            <div className="h-12 w-full rounded-lg bg-skeleton-base/60" />
            <div className="flex justify-between items-center pt-3 border-t border-border/70">
              <div className="h-3 w-20 rounded bg-skeleton-highlight" />
              <div className="h-7 w-24 rounded-lg bg-skeleton-base" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
