// RESPONSIBILITY: Expose migrated settings_general workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminSettingsGeneralWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SETTINGS_GENERAL_ROUTES as __SUPERADMIN_SETTINGS_GENERAL_ROUTES } from "@/app/frontend_superadmin/superadmin_settings/settings_general/config/superadmin_settings_general.url_config";

type SuperadminSettingsGeneralWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'settings_library_configuration', labelKey: 'WORKFLOW_SETTINGS_LIBRARY_CONFIGURATION', href: __SUPERADMIN_SETTINGS_GENERAL_ROUTES.SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS.SETTINGS_LIBRARY_CONFIGURATION },
] as const;

/**
 * Performs the superadmin settings general workflow navigation operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSettingsGeneralWorkflowNavigationProps.
 */
export default function SuperadminSettingsGeneralWorkflowNavigation({ currentView }: SuperadminSettingsGeneralWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_SETTINGS');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-settings_general-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-settings_general-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
