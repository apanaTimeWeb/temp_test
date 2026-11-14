// RESPONSIBILITY: Define compile-time types for communication whatsapp integration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogsComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_views/superadmin_communication_whatsapp_integration_page/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx. */
import type { SuperadminWhatsappMessageLog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/mocks/fixtures/SuperadminCommunicationWhatsappIntegrationWhatsappMockFixtures';

/**
 * Defines the public SuperadminSystemWhatsappMessageLogsProps contract for communication whatsapp integration. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property logs Value defined by the existing feature-local contract. Declared type: SuperadminWhatsappMessageLog[].
 */
export interface SuperadminSystemWhatsappMessageLogsProps { logs: SuperadminWhatsappMessageLog[] }
