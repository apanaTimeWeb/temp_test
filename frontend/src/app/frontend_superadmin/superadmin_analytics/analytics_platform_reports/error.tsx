'use client';
// error.tsx
// RESPONSIBILITY: Route error boundary with retry capability for Platform Reports.

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function SuperadminAnalyticsPlatformReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="p-8 sm:p-12 rounded-2xl border border-destructive/30 bg-destructive/5 text-center flex flex-col items-center justify-center space-y-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Platform Reports Error
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
          {error?.message || 'An unexpected error occurred while compiling platform reports.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
      >
        <RotateCcw size={14} aria-hidden="true" />
        <span>Retry Report Query</span>
      </button>
    </div>
  );
}
