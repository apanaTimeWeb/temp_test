// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/error.tsx
'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50">
      <div className="p-3 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        Error Loading Migration Management
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
        {error.message || 'An unexpected error occurred while loading migration batches.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Retry Operation
      </button>
    </div>
  );
}
