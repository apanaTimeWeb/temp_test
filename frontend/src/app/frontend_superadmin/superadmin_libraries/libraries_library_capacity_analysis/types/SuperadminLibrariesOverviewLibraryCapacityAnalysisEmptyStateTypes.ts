// RESPONSIBILITY: Define compile-time types for libraries library capacity analysis; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_capacity_analysis/types/SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
