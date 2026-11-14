// FLOW: Feature consumers -> superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationWhatsappConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin System Whatsapp Constants; centralizes stable module-owned options and configuration. */
import { CheckCircle, XCircle, Clock } from 'lucide-react';
export const SUPERADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG = {
  delivered: { variant: 'success' as const, icon: CheckCircle },
  failed: { variant: 'danger' as const, icon: XCircle },
  pending: { variant: 'warning' as const, icon: Clock },
};
