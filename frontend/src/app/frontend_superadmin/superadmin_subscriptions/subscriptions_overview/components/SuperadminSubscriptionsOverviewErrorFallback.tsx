/** Feature-local retry fallback for subscriptions_overview; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminSubscriptionsOverviewErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

/**
 * Defines the public SuperadminSubscriptionsOverviewErrorFallbackProps contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminSubscriptionsOverviewErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for subscriptions overview without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSubscriptionsOverviewErrorFallbackProps.
 */
export default function SuperadminSubscriptionsOverviewErrorFallback({ reset }: SuperadminSubscriptionsOverviewErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-rose-500/30 bg-[#0c0f28]/95 p-6 sm:p-8 text-center shadow-xl backdrop-blur-md flex flex-col items-center justify-center" role="alert" data-testid="superadmin_subscriptions_overview-subscriptions_overview-error-fallback">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-100">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        onClick={reset}
        data-testid="superadmin_subscriptions_overview-subscriptions_overview-error-retry"
      >
        <RefreshCcw className="h-4 w-4" />
        <span>{t('COPY.RETRY_MODULE_ROUTE')}</span>
      </button>
    </section>
  );
}
