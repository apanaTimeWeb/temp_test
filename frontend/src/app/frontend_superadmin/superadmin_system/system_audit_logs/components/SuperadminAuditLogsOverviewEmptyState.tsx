/** Responsibility: SuperadminAuditLogsOverviewEmptyState; provides a localized, accessible empty-state message for audit_logs lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminAuditLogsOverviewEmptyStateProps } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewEmptyStateTypes';

/**
 * Renders the empty collection state for audit logs; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAuditLogsOverviewEmptyStateProps.
 */
export default function SuperadminAuditLogsOverviewEmptyState({ filtered = false }: SuperadminAuditLogsOverviewEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_AUDIT_LOGS');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_audit_overview-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
