// RESPONSIBILITY: Expose migrated libraries_onboarding_setup workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminLibrariesOnboardingSetupWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileSpreadsheet, Hash } from 'lucide-react';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES as __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/config/superadmin_libraries_onboarding_setup.url_config";

type SuperadminLibrariesOnboardingSetupWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'student_bulk_import', icon: FileSpreadsheet, labelKey: 'WORKFLOW_STUDENT_BULK_IMPORT', href: __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS.STUDENT_BULK_IMPORT },
  { view: 'student_smart_id', icon: Hash, labelKey: 'WORKFLOW_STUDENT_SMART_ID', href: __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS.STUDENT_SMART_ID },
] as const;

/**
 * Performs the superadmin libraries onboarding setup workflow navigation operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminLibrariesOnboardingSetupWorkflowNavigationProps.
 */
export default function SuperadminLibrariesOnboardingSetupWorkflowNavigation({ currentView }: SuperadminLibrariesOnboardingSetupWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_SETUP_WIZARD');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border/80" data-testid="superadmin-libraries_onboarding_setup-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          const Icon = item.icon;
          return (
            <li key={item.view} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-t-xl border-b-2 px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer ${
                  active
                    ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-xs'
                    : 'border-transparent text-slate-400 hover:bg-surface-hover hover:text-slate-200'
                }`}
                data-testid={`superadmin-libraries_onboarding_setup-workflow-${item.view}`}
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
