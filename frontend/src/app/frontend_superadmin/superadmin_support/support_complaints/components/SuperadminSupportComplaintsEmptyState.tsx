/** Responsibility: SuperadminSupportComplaintsEmptyState; provides a localized, accessible empty-state message for support_complaints lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSupportComplaintsEmptyStateProps } from '@/app/frontend_superadmin/superadmin_support/support_complaints/types/SuperadminSupportComplaintsEmptyStateTypes';

/**
 * Renders the empty collection state for support complaints; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSupportComplaintsEmptyStateProps.
 */
export default function SuperadminSupportComplaintsEmptyState({ filtered = false }: SuperadminSupportComplaintsEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_support_complaints-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
