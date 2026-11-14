// RESPONSIBILITY: Render the route error boundary for communication whatsapp templates; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_communication/communication_whatsapp_templates/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminCommunicationWhatsappTemplatesErrorFallback from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesErrorFallback';
import type { SuperadminCommunicationWhatsappTemplatesSuperadminCommunicationWhatsappTemplatesModuleErrorProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/types/superadmin_communication_whatsapp_templates.types';


/**
 * Performs the module error operation within communication whatsapp templates; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminCommunicationWhatsappTemplatesModuleErrorProps.
 */
export default function ModuleError({ error, reset }: SuperadminCommunicationWhatsappTemplatesModuleErrorProps) {
  return <SuperadminCommunicationWhatsappTemplatesErrorFallback error={error} reset={reset} />;
}
