'use client';
// error.tsx
// RESPONSIBILITY: Route error boundary with retry capability for Billing Reports.

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function SuperadminAnalyticsBillingReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="p-8 sm:p-12 rounded-2xl border border-border bg-danger-bg text-center flex flex-col items-center justify-center space-y-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-danger-bg text-danger flex items-center justify-center border border-border">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-primary">
          Billing Reports Error
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-secondary max-w-md">
          {error?.message || 'An unexpected error occurred while compiling billing and financial reports.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-card motion-safe:active:scale-95"
      >
        <RotateCcw size={14} aria-hidden="true" />
        <span>Retry Financial Query</span>
      </button>
    </div>
  );
}
