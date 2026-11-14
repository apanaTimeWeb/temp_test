// RESPONSIBILITY: Define compile-time types for communication whatsapp integration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminCommunicationWhatsappIntegrationEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
