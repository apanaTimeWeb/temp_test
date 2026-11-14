// RESPONSIBILITY: Define compile-time types for libraries library shift gap analysis; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_shift_gap_analysis/types/SuperadminLibrariesOverviewLibraryShiftGapAnalysisEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewLibraryShiftGapAnalysisEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
