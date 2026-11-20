// FLOW: Feature consumers -> superadmin_billing/billing_invoices/constants/SuperadminBillingInvoicesConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Billing Constants; stable tab IDs and localized labels. */
import { FileText } from 'lucide-react';
export const SUPERADMIN_BILLING_TABS = [
  { id: 'invoices' as const, labelKey: 'COPY.INVOICES_AND_TRANSACTIONS', icon: FileText },
];
