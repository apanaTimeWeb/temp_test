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
      className="mx-auto my-12 max-w-lg rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 text-center backdrop-blur-md shadow-xl"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
        <AlertTriangle size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">Branch Overview Error</h3>
      <p className="mt-1.5 text-xs text-rose-300">
        {error.message || 'An unexpected error occurred while rendering the branch directory.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
