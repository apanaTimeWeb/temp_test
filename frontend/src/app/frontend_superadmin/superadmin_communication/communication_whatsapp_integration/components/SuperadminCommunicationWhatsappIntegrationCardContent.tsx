/** Responsibility: SuperadminCommunicationWhatsappIntegrationCardContent; module-owned presentation component for communication_whatsapp_integration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminCommunicationWhatsappIntegrationCardContent formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/utils/SuperadminCommunicationWhatsappIntegrationClassNameUtilities';
import type { SuperadminSystemCardContentProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationCardContentComponentTypes';

/**
 * Performs the superadmin communication whatsapp integration card content operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardContentProps.
 */
export function SuperadminCommunicationWhatsappIntegrationCardContent({ children, className }: SuperadminSystemCardContentProps) {
  return <div className={cn('sys-card-content', className)}>{children}</div>;
}
