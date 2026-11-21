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
      className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#1a0812] via-[#090d24] to-[#050714] p-10 text-center shadow-xl backdrop-blur-md"
      data-testid="superadmin-integrations-error-fallback"
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 border border-rose-500/30 mb-3 shadow-inner">
        <AlertTriangle size={24} strokeWidth={2} />
      </div>
      <h3 className="text-base font-bold text-slate-100">Integration Hub Service Error</h3>
      <p className="mt-1 max-w-md text-xs text-slate-400 leading-relaxed">
        {error?.message || 'Unable to connect to the integration gateway registry. Please verify backend status and retry.'}
      </p>
      {reset && (
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 text-xs font-semibold text-white cursor-pointer transition-opacity min-w-28 justify-center shadow-md shadow-indigo-500/25"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
