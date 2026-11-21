// RESPONSIBILITY: Not-found state for non-existent library usage routes.
import Link from 'next/link';
import { Gauge, ArrowLeft } from 'lucide-react';

export default function SuperadminUsageOverviewNotFound() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-lg shadow-sky-500/20">
        <Gauge className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-base font-bold text-white">Resource Metrics Profile Not Found</h2>
      <p className="mt-1 max-w-md text-xs text-slate-400 leading-relaxed">
        The requested tenant quota profile or usage snapshot does not exist or has been archived.
      </p>
      <Link
        href="/superadmin/superadmin_usage/usage_overview"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Usage Overview
      </Link>
    </div>
  );
}
