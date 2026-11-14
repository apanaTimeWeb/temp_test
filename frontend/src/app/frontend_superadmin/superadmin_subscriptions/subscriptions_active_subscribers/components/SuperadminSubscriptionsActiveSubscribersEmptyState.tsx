/** Responsibility: SuperadminSubscriptionsActiveSubscribersEmptyState; provides a localized, accessible empty-state message for subscriptions_overview lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSubscriptionsActiveSubscribersEmptyStateProps } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersEmptyStateTypes';

/**
 * Renders the empty collection state for subscriptions active subscribers; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSubscriptionsActiveSubscribersEmptyStateProps.
 */
export default function SuperadminSubscriptionsActiveSubscribersEmptyState({ filtered = false }: SuperadminSubscriptionsActiveSubscribersEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_subscriptions_overview-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
