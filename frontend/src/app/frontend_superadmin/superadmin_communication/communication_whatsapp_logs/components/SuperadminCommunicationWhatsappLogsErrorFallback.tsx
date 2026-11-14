/** Feature-local error fallback. Uses a safe localized message and never exposes raw server/exception details. */
/** Responsibility: SuperadminCommunicationWhatsappLogsErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';

/** Props for the feature-local retryable error fallback. */
type SuperadminCommunicationWhatsappLogsErrorFallbackProps = {
  /** Framework error with an optional typed backend response envelope. */
  error?: Error & { digest?: string; response?: { data?: { message?: unknown } } };
  /** Retries the framework-owned route boundary. */
  onRetry: () => void;
};

/**
 * Renders the safe retry state for communication whatsapp logs without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminCommunicationWhatsappLogsErrorFallbackProps.
 */
export default function SuperadminCommunicationWhatsappLogsErrorFallback({ onRetry }: SuperadminCommunicationWhatsappLogsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_COMMUNICATION');
  const message = t('COPY.MODULE_ROUTE_ERROR_MESSAGE');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin-communication-communication-whatsapp-logs-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{message}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={onRetry} data-testid="superadmin-communication-communication-whatsapp-logs-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}
