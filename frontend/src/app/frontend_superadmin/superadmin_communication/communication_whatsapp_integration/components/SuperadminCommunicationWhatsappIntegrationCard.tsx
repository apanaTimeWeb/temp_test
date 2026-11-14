/** Responsibility: SuperadminCommunicationWhatsappIntegrationCard; module-owned presentation component for communication_whatsapp_integration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminCommunicationWhatsappIntegrationCard formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import type { SuperadminSystemCardProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationCardComponentTypes';

/**
 * Performs the superadmin communication whatsapp integration card operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardProps.
 */
export function SuperadminCommunicationWhatsappIntegrationCard({ children, className }: SuperadminSystemCardProps) {
  return <div className={cn('sys-card', className)}>{children}</div>;
}
