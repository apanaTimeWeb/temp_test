// RESPONSIBILITY: Define compile-time types for libraries facility asset registry; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
