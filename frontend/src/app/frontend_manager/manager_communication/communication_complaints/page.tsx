import { ManagerCommunicationComplaintsMain } from '@/app/frontend_manager/manager_communication/communication_complaints/components/ManagerCommunicationComplaintsMain';
import type { ManagerCommunicationComplaintsMainProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';
import type { ManagerCommunicationComplaintsPageProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerCommunicationComplaintsPage({ searchParams }: ManagerCommunicationComplaintsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerCommunicationComplaintsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerCommunicationComplaintsMain {...mainProps} />;
}
