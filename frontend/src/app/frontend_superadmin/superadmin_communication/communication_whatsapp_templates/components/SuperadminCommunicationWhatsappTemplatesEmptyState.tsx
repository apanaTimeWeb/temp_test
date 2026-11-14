import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Responsibility: render the template-list empty state without sending, saving, or publishing a message. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
/** Flow: feature-local template collection -> empty collection decision -> accessible localized presentation. */
export function SuperadminCommunicationWhatsappTemplatesEmptyState() {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <div className="eng-card flex flex-col items-center gap-3 p-8 text-center" role="status" data-testid="superadmin-communication-communication-whatsapp-templates-empty-state">
      <MessageSquare size={28} aria-hidden="true" className="eng-icon-muted" />
      <h2 className="eng-section-label">{tCopy('COPY.NO_WHATSAPP_TEMPLATES_FOUND')}</h2>
      <p className="eng-muted">{tCopy('COPY.NO_WHATSAPP_TEMPLATES_DESCRIPTION')}</p>
    </div>
  );
}
