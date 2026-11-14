// RESPONSIBILITY: Define compile-time types for communication whatsapp integration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappSummaryComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_views/superadmin_communication_whatsapp_integration_page/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx. */
export type SuperadminWhatsappTestStatus = 'idle' | 'unavailable';

/**
 * Defines the public SuperadminSystemWhatsappSummaryProps contract for communication whatsapp integration. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property testStatus Status value as represented by the existing feature contract. Declared type: SuperadminWhatsappTestStatus.
 * @property messageCount User-safe error or explanatory message; raw exception details are not implied. Declared type: number.
 * @property deliveredCount Value defined by the existing feature-local contract. Declared type: number.
 * @property failedCount Value defined by the existing feature-local contract. Declared type: number.
 * @property deliveryRate Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminSystemWhatsappSummaryProps {
  testStatus: SuperadminWhatsappTestStatus;
  messageCount: number;
  deliveredCount: number;
  failedCount: number;
  deliveryRate: number;
}
