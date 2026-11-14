/** Responsibility: SuperadminCommunicationWhatsappIntegrationCardHeader; module-owned presentation component for communication_whatsapp_integration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminCommunicationWhatsappIntegrationCardHeader formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import type { SuperadminSystemCardHeaderProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationCardHeaderComponentTypes';

/**
 * Performs the superadmin communication whatsapp integration card header operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardHeaderProps.
 */
export function SuperadminCommunicationWhatsappIntegrationCardHeader({ children, className }: SuperadminSystemCardHeaderProps) {
  return <div className={cn('sys-card-header', className)}>{children}</div>;
}
