'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface DomainErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SuperadminSettingsRootError({ error, reset }: DomainErrorProps) {
  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-lg rounded-2xl border border-danger-border bg-danger-bg p-6 text-center shadow-card backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger/20 text-danger border border-danger-border">
        <AlertTriangle size={24} />
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">Settings Domain Error</h3>
      <p className="mt-1.5 text-xs text-danger">
        {error.message || 'An unexpected error occurred in the Global Settings domain.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-white hover:bg-danger/90 transition-colors cursor-pointer"
      >
        <RotateCcw size={14} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
