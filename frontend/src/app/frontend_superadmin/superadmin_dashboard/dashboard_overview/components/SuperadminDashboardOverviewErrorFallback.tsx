/** Feature-local retry fallback for dashboard_overview; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminDashboardOverviewErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';

export type SuperadminDashboardOverviewErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for dashboard overview without exposing raw exception details.
 */
export default function SuperadminDashboardOverviewErrorFallback({ reset }: SuperadminDashboardOverviewErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-rose-500/30 bg-[#1c0a0e]/95 p-6 shadow-md" role="alert" data-testid="superadmin_dashboard_overview-dashboard_overview-error-fallback">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
          <AlertCircle size={20} />
        </div>
        <h2 className="text-lg font-bold text-white">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      </div>
      <p className="mt-2 text-xs sm:text-sm text-slate-300">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button
        type="button"
        className="inline-flex items-center gap-2 min-h-10 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-md shadow-rose-950/50 motion-safe:transition-all hover:scale-[1.02] cursor-pointer mt-4"
        onClick={reset}
        data-testid="superadmin_dashboard_overview-dashboard_overview-error-retry"
      >
        <RotateCcw size={14} />
        <span>{t('COPY.RETRY_MODULE_ROUTE')}</span>
      </button>
    </section>
  );
}
