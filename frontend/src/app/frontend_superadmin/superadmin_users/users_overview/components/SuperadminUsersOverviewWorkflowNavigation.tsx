// RESPONSIBILITY: Expose migrated users_overview workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminUsersOverviewWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminUsersOverviewWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_OVERVIEW_ROUTES as __SUPERADMIN_USERS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_overview/config/superadmin_users_overview.url_config";

type SuperadminUsersOverviewWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'member_referrals', labelKey: 'WORKFLOW_MEMBER_REFERRALS', href: __SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS.MEMBER_REFERRALS },
  { view: 'member_trust_score', labelKey: 'WORKFLOW_MEMBER_TRUST_SCORE', href: __SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS.MEMBER_TRUST_SCORE },
] as const;

/**
 * Performs the superadmin users overview workflow navigation operation within users overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminUsersOverviewWorkflowNavigationProps.
 */
export default function SuperadminUsersOverviewWorkflowNavigation({ currentView }: SuperadminUsersOverviewWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-users_overview-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-users_overview-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
