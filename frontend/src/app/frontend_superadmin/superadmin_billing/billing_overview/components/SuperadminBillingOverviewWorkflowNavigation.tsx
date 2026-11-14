// RESPONSIBILITY: Expose migrated billing_overview workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminBillingOverviewWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminBillingOverviewWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_BILLING_OVERVIEW_ROUTES as __SUPERADMIN_BILLING_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_billing/billing_overview/config/superadmin_billing_overview.url_config";

type SuperadminBillingOverviewWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'member_finance_overview', labelKey: 'WORKFLOW_MEMBER_FINANCE_OVERVIEW', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_FINANCE_OVERVIEW },
  { view: 'member_late_fees', labelKey: 'WORKFLOW_MEMBER_LATE_FEES', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_LATE_FEES },
  { view: 'member_payment_promises', labelKey: 'WORKFLOW_MEMBER_PAYMENT_PROMISES', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_PAYMENT_PROMISES },
  { view: 'member_payments', labelKey: 'WORKFLOW_MEMBER_PAYMENTS', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_PAYMENTS },
  { view: 'member_payments_collection', labelKey: 'WORKFLOW_MEMBER_PAYMENTS_COLLECTION', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_PAYMENTS_COLLECTION },
  { view: 'member_refunds', labelKey: 'WORKFLOW_MEMBER_REFUNDS', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_REFUNDS },
  { view: 'member_security_deposits', labelKey: 'WORKFLOW_MEMBER_SECURITY_DEPOSITS', href: __SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS.MEMBER_SECURITY_DEPOSITS },
] as const;

/**
 * Performs the superadmin billing overview workflow navigation operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBillingOverviewWorkflowNavigationProps.
 */
export default function SuperadminBillingOverviewWorkflowNavigation({ currentView }: SuperadminBillingOverviewWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-billing_overview-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-billing_overview-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
