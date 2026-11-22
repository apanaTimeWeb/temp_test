import type { AdminCommunicationWhatsappTemplatesScenario } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminCommunicationWhatsappTemplatesHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationWhatsappTemplatesScenario;
}
