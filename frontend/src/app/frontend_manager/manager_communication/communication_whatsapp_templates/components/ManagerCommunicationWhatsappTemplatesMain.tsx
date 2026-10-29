'use client';
import ManagerCommunicationWhatsappTemplatesPage from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/components/manager_communication_whatsapp_templates_views/ManagerCommunicationWhatsappTemplatesPage.tsx';
import type { ManagerCommunicationWhatsappTemplatesMainProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesMainTypes';

export function ManagerCommunicationWhatsappTemplatesMain(props: ManagerCommunicationWhatsappTemplatesMainProps) {
  return <ManagerCommunicationWhatsappTemplatesPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
