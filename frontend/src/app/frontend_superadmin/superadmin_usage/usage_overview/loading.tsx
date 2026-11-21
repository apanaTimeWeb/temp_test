'use client';
// RESPONSIBILITY: Loading skeleton boundary for superadmin usage overview.
export default function SuperadminUsageOverviewLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse p-2" role="status" aria-busy="true">
      <div className="h-16 w-full rounded-2xl bg-card/60 border border-border/60" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-card/60 border border-border/60" />
        ))}
      </div>
      <div className="h-96 w-full rounded-2xl bg-card/60 border border-border/60" />
    </div>
  );
}
