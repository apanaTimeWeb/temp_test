/** Responsibility: SuperadminUsersRolesPermissionsEmptyState; provides a localized, accessible empty-state message for the Roles & Permissions matrix. */
/** Data-Flow: owning feature collection/filter -> zero-row decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminUsersRolesPermissionsEmptyStateProps } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminUsersRolesPermissionsEmptyStateTypes';

/**
 * Renders the empty matrix state for Roles & Permissions; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminUsersRolesPermissionsEmptyStateProps.
 */
export default function SuperadminUsersRolesPermissionsEmptyState({ filtered = false }: SuperadminUsersRolesPermissionsEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_USERS');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin-users-roles-permissions-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
