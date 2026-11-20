// components/SuperadminIntegrationsOverviewErrorFallback.tsx
// RESPONSIBILITY: Display error boundary fallback matching app shell with retry CTA.
// DATA FLOW: Error state -> SuperadminIntegrationsOverviewErrorFallback -> user retry action.
'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

interface SuperadminIntegrationsOverviewErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export const SuperadminIntegrationsOverviewErrorFallback: React.FC<
  SuperadminIntegrationsOverviewErrorFallbackProps
> = ({ error, reset }) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-danger/30 bg-card p-10 text-center shadow-xs"
      data-testid="superadmin-integrations-error-fallback"
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-bg text-danger-text mb-3 shadow-xs">
        <AlertTriangle size={24} strokeWidth={2} />
      </div>
      <h3 className="text-base font-bold text-foreground">Integration Hub Service Error</h3>
      <p className="mt-1 max-w-md text-xs text-muted-foreground leading-relaxed">
        {error?.message || 'Unable to connect to the integration gateway registry. Please verify backend status and retry.'}
      </p>
      {reset && (
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90 cursor-pointer transition-opacity min-w-28 justify-center shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
