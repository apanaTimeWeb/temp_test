// RESPONSIBILITY: Define compile-time types for communication whatsapp logs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminCommunicationWhatsappLogsEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
