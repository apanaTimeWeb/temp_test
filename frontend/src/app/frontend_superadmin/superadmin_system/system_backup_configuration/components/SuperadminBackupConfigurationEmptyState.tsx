/** Responsibility: SuperadminBackupConfigurationEmptyState; provides a localized, accessible empty-state message for backup_configuration lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminBackupConfigurationEmptyStateProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationEmptyStateTypes';

/**
 * Renders the empty collection state for backup configuration; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBackupConfigurationEmptyStateProps.
 */
export default function SuperadminBackupConfigurationEmptyState({ filtered = false }: SuperadminBackupConfigurationEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_backup_configuration-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
