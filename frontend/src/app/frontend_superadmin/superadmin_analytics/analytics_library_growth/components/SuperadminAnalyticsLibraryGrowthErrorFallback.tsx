/** Feature-local retry fallback; never exposes raw server/exception text or stack traces. */
/** Responsibility: SuperadminAnalyticsLibraryGrowthErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';

type SuperadminAnalyticsLibraryGrowthErrorFallbackProps = {
  error?: Error & { digest?: string; response?: { data?: { message?: unknown } } };
  onRetry: () => void;
};

/**
 * Renders the safe retry state for analytics library growth without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAnalyticsLibraryGrowthErrorFallbackProps.
 */
export default function SuperadminAnalyticsLibraryGrowthErrorFallback({ onRetry }: SuperadminAnalyticsLibraryGrowthErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_REPORTS');
  const message = t('COPY.MODULE_ROUTE_ERROR_MESSAGE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_analytics-analytics_library_growth-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{message}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={onRetry} data-testid="superadmin_analytics-analytics_library_growth-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}
