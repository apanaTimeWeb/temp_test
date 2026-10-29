'use client';
import ManagerCommunicationWhatsappLogsPage from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsPage.tsx';
import type { ManagerCommunicationWhatsappLogsMainProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsMainTypes';

export function ManagerCommunicationWhatsappLogsMain(props: ManagerCommunicationWhatsappLogsMainProps) {
  return <ManagerCommunicationWhatsappLogsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
