// loading.tsx
export default function SuperadminUsageQuotaRequestsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 rounded-xl border border-slate-800 bg-slate-900/60" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-slate-800 bg-slate-900/60" />
        ))}
      </div>
      <div className="h-14 rounded-xl border border-slate-800 bg-slate-900/60" />
      <div className="h-96 rounded-xl border border-slate-800 bg-slate-900/60" />
    </div>
  );
}
