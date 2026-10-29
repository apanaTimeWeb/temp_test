/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerCommunicationWhatsappTemplatesSearchParams } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesMainTypes';

// RESPONSIBILITY: Render the ManagerCommunicationWhatsappTemplates feature view and preserve route query context.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export type ManagerCommunicationWhatsappTemplatesRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerCommunicationWhatsappTemplatesPageProps = {
  searchParams?: Promise<ManagerCommunicationWhatsappTemplatesSearchParams>;
};
