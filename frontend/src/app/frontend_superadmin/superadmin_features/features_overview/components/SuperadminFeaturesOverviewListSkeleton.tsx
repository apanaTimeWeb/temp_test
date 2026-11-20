// RESPONSIBILITY: High-fidelity loading skeleton for SuperAdmin Feature & Module Governance.
import React from 'react';

export default function SuperadminFeaturesOverviewListSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading feature controls">
      {/* Header skeleton */}
      <div className="h-14 bg-neutral-800/40 rounded-xl" />

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-neutral-800/40 rounded-xl" />
        ))}
      </div>

      {/* Scope selector skeleton */}
      <div className="h-24 bg-neutral-800/40 rounded-xl" />

      {/* Filter and tabs skeleton */}
      <div className="h-10 bg-neutral-800/40 rounded-lg" />

      {/* Module grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-neutral-800/40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
