import React from 'react';

export default function SuperadminBranchesOverviewListSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-indigo-500/20 bg-slate-900/50">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-indigo-600/30 rounded-xl" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`kpi-skel-${idx}`} className="h-24 rounded-2xl border border-indigo-500/15 bg-slate-900/40 p-4 space-y-2">
            <div className="h-3 w-20 bg-slate-800 rounded" />
            <div className="h-7 w-16 bg-slate-800/80 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/40 p-4 space-y-3">
        <div className="h-10 w-full bg-slate-800/50 rounded-xl" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={`row-skel-${idx}`} className="h-14 w-full bg-slate-800/30 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
