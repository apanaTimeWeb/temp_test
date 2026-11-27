'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SecurityAuditLogsError({ error, reset }: ErrorProps) {
  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-lg rounded-2xl border border-danger-border bg-danger-bg p-6 text-center shadow-card backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger-bg text-danger border border-border">
        <AlertTriangle size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-primary">Audit Logs Error</h3>
      <p className="mt-1.5 text-xs text-danger">
        {error.message || 'An unexpected error occurred while loading audit logs.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-on-danger hover:bg-danger-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
