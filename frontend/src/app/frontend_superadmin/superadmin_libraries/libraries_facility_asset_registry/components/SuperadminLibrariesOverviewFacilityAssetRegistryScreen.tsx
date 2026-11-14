/** Responsibility: Route adapter for the facility_asset_registry screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewFacilityAssetRegistryScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `assets` inside the facility_asset_registry autonomous module. */
import SuperadminLibrariesOverviewFacilityAssetRegistryPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewFacilityAssetRegistryScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewFacilityAssetRegistryPageClient />;
}
