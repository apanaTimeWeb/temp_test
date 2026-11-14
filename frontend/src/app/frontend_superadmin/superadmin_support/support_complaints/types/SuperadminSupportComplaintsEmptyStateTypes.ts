// RESPONSIBILITY: Define compile-time types for support complaints; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_support/support_complaints/types/SuperadminSupportComplaintsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminSupportComplaintsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
