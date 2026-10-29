import { ManagerCommunicationWhatsappLogsMain } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/ManagerCommunicationWhatsappLogsMain';
import type { ManagerCommunicationWhatsappLogsMainProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsMainTypes';
import type { ManagerCommunicationWhatsappLogsPageProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';



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
  return <ManagerCommunicationWhatsappLogsMain {...mainProps} />;
}
