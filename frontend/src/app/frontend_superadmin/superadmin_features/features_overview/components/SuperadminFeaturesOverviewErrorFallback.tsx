// RESPONSIBILITY: Graceful error fallback with retry capability for feature governance.
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function SuperadminFeaturesOverviewErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-center max-w-lg mx-auto my-8 space-y-4">
      <div className="p-3 rounded-full bg-rose-500/15 text-rose-400 inline-block">
        <AlertTriangle size={28} />
      </div>
      <div>
        <h3 className="text-base font-bold text-white">Feature Governance Failed to Load</h3>
        <p className="text-xs text-neutral-400 mt-1">
          {error?.message || 'An unexpected error occurred while resolving module permissions and overrides.'}
        </p>
      </div>
      {resetErrorBoundary && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={14} />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
}
