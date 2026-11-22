/** Responsibility: SuperadminBackupOverviewEmptyState; provides a localized, accessible empty-state message for backup_overview lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminBackupOverviewEmptyStateProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/types/SuperadminBackupOverviewEmptyStateTypes';

/**
 * Renders the empty collection state for backup overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBackupOverviewEmptyStateProps.
 */
export default function SuperadminBackupOverviewEmptyState({ filtered = false }: SuperadminBackupOverviewEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_backup_overview-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
