/** Responsibility: SuperadminCommunicationWhatsappIntegrationEmptyState; provides a localized, accessible empty-state message for communication_whatsapp_integration lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminCommunicationWhatsappIntegrationEmptyStateProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationEmptyStateTypes';

/**
 * Renders the empty collection state for communication whatsapp integration; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminCommunicationWhatsappIntegrationEmptyStateProps.
 */
export default function SuperadminCommunicationWhatsappIntegrationEmptyState({ filtered = false }: SuperadminCommunicationWhatsappIntegrationEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_communication_whatsapp_integration-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
