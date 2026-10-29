import { ManagerCommunicationWhatsappTemplatesMain } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/components/ManagerCommunicationWhatsappTemplatesMain';
import type { ManagerCommunicationWhatsappTemplatesMainProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesMainTypes';
import type { ManagerCommunicationWhatsappTemplatesPageProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerCommunicationWhatsappTemplatesPage({ searchParams }: ManagerCommunicationWhatsappTemplatesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerCommunicationWhatsappTemplatesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerCommunicationWhatsappTemplatesMain {...mainProps} />;
}
