/** Responsibility: SuperadminBackupSchedulesEmptyState; provides a localized, accessible empty-state message for backup_overview lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminBackupSchedulesEmptyStateProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_schedules/types/SuperadminBackupSchedulesEmptyStateTypes';

/**
 * Renders the empty collection state for backup schedules; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBackupSchedulesEmptyStateProps.
 */
export default function SuperadminBackupSchedulesEmptyState({ filtered = false }: SuperadminBackupSchedulesEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_backup_overview-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
