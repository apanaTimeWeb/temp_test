'use client';
// error.tsx
// RESPONSIBILITY: Route error boundary with retry capability for Superadmin Security Reports.

import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function SuperadminAnalyticsSecurityReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="p-8 sm:p-12 text-center rounded-2xl border border-border bg-danger-bg space-y-4 max-w-lg mx-auto mt-12"
      role="alert"
    >
      <div className="w-12 h-12 mx-auto rounded-2xl bg-danger-bg text-danger flex items-center justify-center border border-border">
        <ShieldAlert size={24} />
      </div>
      <h2 className="text-base font-bold text-primary">Security Reports Telemetry Error</h2>
      <p className="text-xs text-secondary leading-relaxed">
        {error.message || 'An unexpected error occurred while fetching security audit logs.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Retry Loading</span>
      </button>
    </div>
  );
}
