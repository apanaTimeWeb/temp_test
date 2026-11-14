// RESPONSIBILITY: Expose migrated subscriptions_overview workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminSubscriptionsOverviewWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminSubscriptionsOverviewWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES as __SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/config/superadmin_subscriptions_overview.url_config";

type SuperadminSubscriptionsOverviewWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'member_auto_suspend_policy', labelKey: 'WORKFLOW_MEMBER_AUTO_SUSPEND_POLICY', href: __SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS.MEMBER_AUTO_SUSPEND_POLICY },
  { view: 'member_renewals', labelKey: 'WORKFLOW_MEMBER_RENEWALS', href: __SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS.MEMBER_RENEWALS },
  { view: 'member_subscriptions', labelKey: 'WORKFLOW_MEMBER_SUBSCRIPTIONS', href: __SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_ROUTES.SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_WORKFLOW_URLS.MEMBER_SUBSCRIPTIONS },
] as const;

/**
 * Performs the superadmin subscriptions overview workflow navigation operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSubscriptionsOverviewWorkflowNavigationProps.
 */
export default function SuperadminSubscriptionsOverviewWorkflowNavigation({ currentView }: SuperadminSubscriptionsOverviewWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-subscriptions_overview-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-subscriptions_overview-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
