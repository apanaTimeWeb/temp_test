// RESPONSIBILITY: Define compile-time types for libraries overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOverviewEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
