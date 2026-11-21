'use client';
// error.tsx
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function SuperadminUsageQuotaRequestsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/20">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-base font-bold text-white">Quota Requests Unavailable</h2>
      <p className="mt-1 max-w-md text-xs text-slate-400 leading-relaxed">
        {error.message || 'Unable to retrieve pending quota requests. Please retry.'}
      </p>
      <button
        onClick={() => reset()}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/30 hover:bg-rose-500 cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry Loading Requests
      </button>
    </div>
  );
}
