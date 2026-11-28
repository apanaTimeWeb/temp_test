import { ManagerCommunicationWhatsappLogsMain } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/ManagerCommunicationWhatsappLogsMain';
import type { ManagerCommunicationWhatsappLogsPageProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';
import type { ManagerCommunicationWhatsappLogsMainProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerCommunicationWhatsappLogsPage({ searchParams }: ManagerCommunicationWhatsappLogsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerCommunicationWhatsappLogsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerCommunicationWhatsappLogsMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}
