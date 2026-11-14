// RESPONSIBILITY: Expose migrated libraries_overview workflows as leaf-local tabs without adding extra route submodules.
// FLOW: Canonical owner page -> SuperadminLibrariesOverviewWorkflowNavigation -> URL config workflow map -> same-leaf view query -> workflow screen.
'use client';

/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewWorkflowNavigation formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES as __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_overview/config/superadmin_libraries_overview.url_config";

type SuperadminLibrariesOverviewWorkflowNavigationProps = { currentView?: string };

const WORKFLOW_ITEMS = [
  { view: 'facility_asset_maintenance', labelKey: 'WORKFLOW_FACILITY_ASSET_MAINTENANCE', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.FACILITY_ASSET_MAINTENANCE },
  { view: 'facility_asset_registry', labelKey: 'WORKFLOW_FACILITY_ASSET_REGISTRY', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.FACILITY_ASSET_REGISTRY },
  { view: 'facility_maintenance_work_orders', labelKey: 'WORKFLOW_FACILITY_MAINTENANCE_WORK_ORDERS', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.FACILITY_MAINTENANCE_WORK_ORDERS },
  { view: 'facility_power_management', labelKey: 'WORKFLOW_FACILITY_POWER_MANAGEMENT', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.FACILITY_POWER_MANAGEMENT },
  { view: 'library_capacity_analysis', labelKey: 'WORKFLOW_LIBRARY_CAPACITY_ANALYSIS', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_CAPACITY_ANALYSIS },
  { view: 'library_capacity_gap_filling', labelKey: 'WORKFLOW_LIBRARY_CAPACITY_GAP_FILLING', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_CAPACITY_GAP_FILLING },
  { view: 'library_capacity_scaling_recommendations', labelKey: 'WORKFLOW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS },
  { view: 'library_offline_operations', labelKey: 'WORKFLOW_LIBRARY_OFFLINE_OPERATIONS', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_OFFLINE_OPERATIONS },
  { view: 'library_shift_gap_analysis', labelKey: 'WORKFLOW_LIBRARY_SHIFT_GAP_ANALYSIS', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_SHIFT_GAP_ANALYSIS },
  { view: 'library_waitlist_automation', labelKey: 'WORKFLOW_LIBRARY_WAITLIST_AUTOMATION', href: __SUPERADMIN_LIBRARIES_OVERVIEW_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_WORKFLOW_URLS.LIBRARY_WAITLIST_AUTOMATION },
] as const;

/**
 * Performs the superadmin libraries overview workflow navigation operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminLibrariesOverviewWorkflowNavigationProps.
 */
export default function SuperadminLibrariesOverviewWorkflowNavigation({ currentView }: SuperadminLibrariesOverviewWorkflowNavigationProps) {
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  return (
    <nav aria-label={t('COPY.WORKFLOW_NAVIGATION')} className="mb-4 border-b border-border" data-testid="superadmin-libraries_overview-workflow-navigation">
      <ul className="flex min-w-0 flex-wrap gap-2" role="list">
        {WORKFLOW_ITEMS.map((item) => {
          const active = currentView === item.view || currentView === `${item.view}_detail`;
          return (
            <li key={item.view} className="min-w-0">
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-focus bg-primary-subtle text-primary' : 'border-transparent text-secondary hover:bg-surface-hover hover:text-primary'}`} data-testid={`superadmin-libraries_overview-workflow-${item.view}`}>
                {t(`COPY.${item.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
