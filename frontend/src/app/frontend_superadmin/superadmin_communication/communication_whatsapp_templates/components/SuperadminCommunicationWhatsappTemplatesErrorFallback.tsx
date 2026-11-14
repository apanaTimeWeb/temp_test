/** Feature-local retry fallback for communication_whatsapp_templates; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminCommunicationWhatsappTemplatesErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';
import type { SuperadminCommunicationWhatsappTemplatesErrorFallbackProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/types/superadmin_communication_whatsapp_templates.types';

/**
 * Renders the safe retry state for communication whatsapp templates without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminCommunicationWhatsappTemplatesErrorFallbackProps.
 */
export default function SuperadminCommunicationWhatsappTemplatesErrorFallback({ reset }: SuperadminCommunicationWhatsappTemplatesErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_communication_whatsapp_templates-communication_whatsapp_templates-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={reset} data-testid="superadmin_communication_whatsapp_templates-communication_whatsapp_templates-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}
