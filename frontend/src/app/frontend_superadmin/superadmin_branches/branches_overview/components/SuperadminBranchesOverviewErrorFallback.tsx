'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface SuperadminBranchesOverviewErrorFallbackProps {
  error: Error & { digest?: string };
  onRetry: () => void;
}

export default function SuperadminBranchesOverviewErrorFallback({
  error,
  onRetry,
}: SuperadminBranchesOverviewErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-lg rounded-2xl border border-danger-border bg-danger-bg p-6 text-center backdrop-blur-md shadow-card"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger-bg text-danger border border-danger-border">
        <AlertTriangle size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">Branch Overview Error</h3>
      <p className="mt-1.5 text-xs text-danger">
        {error.message || 'An unexpected error occurred while rendering the branch directory.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-white hover:bg-danger transition-colors cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
