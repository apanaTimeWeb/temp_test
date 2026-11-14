/** Responsibility: SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState; provides a localized, accessible empty-state message for member_invoice_detail lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyStateProps } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/types/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyStateTypes';

/**
 * Renders the empty collection state for billing invoices; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyStateProps.
 */
export default function SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState({ filtered = false }: SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_member_invoice_detail-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
