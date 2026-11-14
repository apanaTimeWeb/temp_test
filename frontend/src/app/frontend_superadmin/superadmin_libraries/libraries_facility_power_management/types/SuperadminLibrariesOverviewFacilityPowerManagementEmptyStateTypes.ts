// RESPONSIBILITY: Define compile-time types for libraries facility power management; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
