/** Responsibility: SuperadminAccountingExpensesEmptyState; provides a localized, accessible empty-state message for accounting_expenses lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminAccountingExpensesEmptyStateProps } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesEmptyStateTypes';

/**
 * Renders the empty collection state for accounting expenses; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAccountingExpensesEmptyStateProps.
 */
export default function SuperadminAccountingExpensesEmptyState({ filtered = false }: SuperadminAccountingExpensesEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_accounting_expenses-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
