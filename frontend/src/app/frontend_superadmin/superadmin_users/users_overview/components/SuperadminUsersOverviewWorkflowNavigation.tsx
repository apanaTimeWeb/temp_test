// RESPONSIBILITY: Expose migrated users_overview workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminUsersOverviewWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminUsersOverviewWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Share2, Award } from 'lucide-react';
import { SUPERADMIN_USERS_OVERVIEW_ROUTES as __SUPERADMIN_USERS_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_overview/config/superadmin_users_overview.url_config";

type SuperadminUsersOverviewWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'member_referrals', labelKey: 'WORKFLOW_MEMBER_REFERRALS', icon: Share2, href: __SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS.MEMBER_REFERRALS },
  { view: 'member_trust_score', labelKey: 'WORKFLOW_MEMBER_TRUST_SCORE', icon: Award, href: __SUPERADMIN_USERS_OVERVIEW_ROUTES.SUPERADMIN_USERS_OVERVIEW_WORKFLOW_URLS.MEMBER_TRUST_SCORE },
] as const;

/**
 * Performs the superadmin users overview workflow navigation operation within users overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminUsersOverviewWorkflowNavigationProps.
 */
export default function SuperadminUsersOverviewWorkflowNavigation({ currentView }: SuperadminUsersOverviewWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-6 border-b border-border/80 overflow-x-auto" data-testid="superadmin-users_overview-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          const Icon = item.icon;
          return (
            <li key={item.view} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                  active
                    ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                    : 'border-transparent text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                }`}
                data-testid={`superadmin-users_overview-workflow-${item.view}`}
              >
                <Icon size={15} className={active ? 'text-indigo-400' : 'text-slate-400'} />
                <span>{t(`COPY.${item.labelKey}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
