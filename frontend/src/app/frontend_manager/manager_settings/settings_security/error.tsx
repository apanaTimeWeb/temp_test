'use client';

import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function ManagerSettingsSecurityError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background p-6 flex items-center justify-center">
      <section
        className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-sm text-center space-y-4"
        role="alert"
      >
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            Security Module Error
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            An unexpected error occurred while loading manager security settings. Please try again.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reload Security Module
        </button>
      </section>
    </main>
  );
}
