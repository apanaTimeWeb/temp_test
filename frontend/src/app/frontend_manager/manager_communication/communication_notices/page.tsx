import { ManagerCommunicationNoticesMain } from '@/app/frontend_manager/manager_communication/communication_notices/components/ManagerCommunicationNoticesMain';
import type { ManagerCommunicationNoticesMainProps } from '@/app/frontend_manager/manager_communication/communication_notices/types/ManagerCommunicationNoticesMainTypes';
import type { ManagerCommunicationNoticesPageProps } from '@/app/frontend_manager/manager_communication/communication_notices/types/ManagerCommunicationNoticesComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerCommunicationNoticesPage({ searchParams }: ManagerCommunicationNoticesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerCommunicationNoticesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerCommunicationNoticesMain {...mainProps} />;
}
