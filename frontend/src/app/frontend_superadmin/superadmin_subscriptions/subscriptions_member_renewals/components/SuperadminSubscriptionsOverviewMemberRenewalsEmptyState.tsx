/** Responsibility: SuperadminSubscriptionsOverviewMemberRenewalsEmptyState; provides a localized, accessible empty-state message for member_renewals lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateProps } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateTypes';

/**
 * Renders the empty collection state for subscriptions overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateProps.
 */
export default function SuperadminSubscriptionsOverviewMemberRenewalsEmptyState({ filtered = false }: SuperadminSubscriptionsOverviewMemberRenewalsEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_member_renewals-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
