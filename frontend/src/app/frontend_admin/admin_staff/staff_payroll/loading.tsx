'use client';

export default function AdminStaffPayrollLoading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="h-8 w-64 rounded bg-surface" />
      <div className="h-4 w-96 rounded bg-surface" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-card p-4" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-border bg-card" />
    </div>
  );
}

