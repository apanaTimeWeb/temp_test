/** Feature-local retry fallback for system_health_overview; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminSystemHealthOverviewErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';

/**
 * Defines the public SuperadminSystemHealthOverviewErrorFallbackProps contract for system health overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminSystemHealthOverviewErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for system health overview without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemHealthOverviewErrorFallbackProps.
 */
export default function SuperadminSystemHealthOverviewErrorFallback({ reset }: SuperadminSystemHealthOverviewErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_SYSTEM_HEALTH');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_system_health_overview-system_health_overview-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={reset} data-testid="superadmin_system_health_overview-system_health_overview-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}
