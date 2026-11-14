// RESPONSIBILITY: Define compile-time types for communication notices; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminCommunicationNoticesEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
