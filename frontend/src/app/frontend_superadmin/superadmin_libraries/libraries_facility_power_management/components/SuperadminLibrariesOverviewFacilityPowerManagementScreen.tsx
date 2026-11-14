/** Responsibility: Route adapter for the facility_power_management screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewFacilityPowerManagementScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `power_saving` inside the facility_power_management autonomous module. */
import SuperadminLibrariesOverviewFacilityPowerManagementPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewFacilityPowerManagementScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewFacilityPowerManagementPageClient />;
}
