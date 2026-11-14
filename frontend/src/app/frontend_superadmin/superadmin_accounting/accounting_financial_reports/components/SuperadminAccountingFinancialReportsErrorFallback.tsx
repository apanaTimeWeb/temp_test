/** Feature-local retry fallback for accounting_financial_reports; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminAccountingFinancialReportsErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';

/**
 * Defines the public SuperadminAccountingFinancialReportsErrorFallbackProps contract for accounting financial reports. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminAccountingFinancialReportsErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for accounting financial reports without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAccountingFinancialReportsErrorFallbackProps.
 */
export default function SuperadminAccountingFinancialReportsErrorFallback({ reset }: SuperadminAccountingFinancialReportsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_accounting_financial_reports-accounting_financial_reports-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={reset} data-testid="superadmin_accounting_financial_reports-accounting_financial_reports-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}
