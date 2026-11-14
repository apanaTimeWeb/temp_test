// RESPONSIBILITY: Define compile-time types for libraries facility maintenance work orders; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
