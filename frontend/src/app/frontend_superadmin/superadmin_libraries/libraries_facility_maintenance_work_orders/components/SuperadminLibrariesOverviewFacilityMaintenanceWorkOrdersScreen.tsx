/** Responsibility: Route adapter for the facility_maintenance_work_orders screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `maintenance` inside the facility_maintenance_work_orders autonomous module. */
import SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient />;
}
