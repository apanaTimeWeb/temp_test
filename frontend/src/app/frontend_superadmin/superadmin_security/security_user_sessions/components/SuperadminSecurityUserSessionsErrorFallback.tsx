/** Feature-local error fallback. Uses a safe localized message and never exposes raw server/exception details. */
/** Responsibility: SuperadminSecurityUserSessionsErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';

/** Props for the feature-local retryable error fallback. */
type SuperadminSecurityUserSessionsErrorFallbackProps = {
  /** Framework error with an optional typed backend response envelope. */
  error?: Error & { digest?: string; response?: { data?: { message?: unknown } } };
  /** Retries the framework-owned route boundary. */
  onRetry: () => void;
};

/**
 * Renders the safe retry state for security user sessions without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSecurityUserSessionsErrorFallbackProps.
 */
export default function SuperadminSecurityUserSessionsErrorFallback({ onRetry }: SuperadminSecurityUserSessionsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_USERS');
  const message = t('COPY.MODULE_ROUTE_ERROR_MESSAGE');
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <section
        className="w-full max-w-lg rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8 text-center backdrop-blur-md shadow-xl"
        role="alert"
        data-testid="superadmin-security-security-user-sessions-error-fallback"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/40 bg-rose-500/20 text-rose-400">
          <AlertCircle size={28} aria-hidden="true" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{message}</p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-95 cursor-pointer"
            onClick={onRetry}
            data-testid="superadmin-security-security-user-sessions-error-retry"
          >
            <RotateCcw size={15} />
            <span>{t('COPY.RETRY_MODULE_ROUTE')}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
