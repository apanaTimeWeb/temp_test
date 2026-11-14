/** Responsibility: SuperadminPlansPromotionsEmptyState; provides a localized, accessible empty-state message for the plans_promotions preview list. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminPlansPromotionsEmptyStateProps } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsEmptyStateTypes';

/**
 * Renders the empty collection state for plans promotions; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminPlansPromotionsEmptyStateProps.
 */
export default function SuperadminPlansPromotionsEmptyState({ filtered = false }: SuperadminPlansPromotionsEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin-plans-promotions-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
