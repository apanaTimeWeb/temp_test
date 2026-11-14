// RESPONSIBILITY: Define compile-time types for libraries facility asset maintenance; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_asset_maintenance/types/SuperadminLibrariesOverviewFacilityAssetMaintenanceEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewFacilityAssetMaintenanceEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
