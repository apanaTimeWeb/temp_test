/** Responsibility: SuperadminUsersOverviewMemberTrustScoreEmptyState; provides a localized, accessible empty-state message for member_trust_score lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminUsersOverviewMemberTrustScoreEmptyStateProps } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/types/SuperadminUsersOverviewMemberTrustScoreEmptyStateTypes';

/**
 * Renders the empty collection state for users overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminUsersOverviewMemberTrustScoreEmptyStateProps.
 */
export default function SuperadminUsersOverviewMemberTrustScoreEmptyState({ filtered = false }: SuperadminUsersOverviewMemberTrustScoreEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_member_trust_score-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
