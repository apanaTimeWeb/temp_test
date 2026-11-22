/** Feature-local retry fallback for plans_promotions; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminPlansPromotionsErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Defines the public SuperadminPlansPromotionsErrorFallbackProps contract for plans promotions. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminPlansPromotionsErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for plans promotions without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminPlansPromotionsErrorFallbackProps.
 */
export default function SuperadminPlansPromotionsErrorFallback({ reset }: SuperadminPlansPromotionsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_BILLING');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-rose-500/30 bg-[#0c0f28]/95 p-6 sm:p-8 shadow-xl backdrop-blur-md" role="alert" data-testid="superadmin_plans_promotions-plans_promotions-error-fallback">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-100">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      </div>
      <p className="mt-2 text-sm text-slate-400">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        onClick={reset}
        data-testid="superadmin_plans_promotions-plans_promotions-error-retry"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>{t('COPY.RETRY_MODULE_ROUTE')}</span>
      </button>
    </section>
  );
}
