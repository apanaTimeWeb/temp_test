'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function SuperadminAnalyticsRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Superadmin Analytics domain error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur">
        <h2 className="text-xl font-bold text-red-400">Analytics Domain Error</h2>
        <p className="mt-2 text-sm text-slate-400">
          An error occurred in the Superadmin Analytics workspace.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Try Again
          </button>
          <Link
            href="/superadmin/superadmin_analytics/analytics_platform_reports"
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
          >
            Return to Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
