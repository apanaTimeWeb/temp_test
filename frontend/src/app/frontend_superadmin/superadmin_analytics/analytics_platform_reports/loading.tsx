// loading.tsx
// RESPONSIBILITY: Skeleton loading layout matching Superadmin Platform Reports UI.

import React from 'react';

export default function SuperadminAnalyticsPlatformReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-full" role="status" aria-label="Loading Platform Reports">
      {/* Header Skeleton */}
      <div className="p-6 rounded-2xl border border-border/40 bg-card/40 h-28 flex flex-col justify-between">
        <div className="h-4 w-32 bg-muted rounded-md" />
        <div className="h-7 w-72 bg-muted rounded-md" />
        <div className="h-3 w-96 bg-muted/60 rounded-md" />
      </div>

      {/* 6 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border/40 bg-card/40 h-24 flex flex-col justify-between">
            <div className="h-3 w-20 bg-muted rounded-md" />
            <div className="h-6 w-16 bg-muted rounded-md" />
            <div className="h-2 w-24 bg-muted/60 rounded-md" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border/40 bg-card/40 h-64" />
        <div className="p-5 rounded-2xl border border-border/40 bg-card/40 h-64" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-5 rounded-2xl border border-border/40 bg-card/40 h-24" />

      {/* Table Skeleton */}
      <div className="p-5 rounded-2xl border border-border/40 bg-card/40 h-72" />
    </div>
  );
}
