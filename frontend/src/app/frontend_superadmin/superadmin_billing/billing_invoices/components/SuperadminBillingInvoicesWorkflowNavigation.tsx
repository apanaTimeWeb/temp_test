// RESPONSIBILITY: Expose migrated billing_invoices workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminBillingInvoicesWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_BILLING_INVOICES_ROUTES as __SUPERADMIN_BILLING_INVOICES_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_invoices/config/superadmin_billing_invoices.url_config";

type SuperadminBillingInvoicesWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'member_invoices', labelKey: 'WORKFLOW_MEMBER_INVOICES', href: __SUPERADMIN_BILLING_INVOICES_ROUTES.SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS.MEMBER_INVOICES },
  { view: 'member_receipts', labelKey: 'WORKFLOW_MEMBER_RECEIPTS', href: __SUPERADMIN_BILLING_INVOICES_ROUTES.SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS.MEMBER_RECEIPTS },
] as const;

/**
 * Performs the superadmin billing invoices workflow navigation operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBillingInvoicesWorkflowNavigationProps.
 */
export default function SuperadminBillingInvoicesWorkflowNavigation({ currentView }: SuperadminBillingInvoicesWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_BILLING');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-billing_invoices-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-billing_invoices-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
