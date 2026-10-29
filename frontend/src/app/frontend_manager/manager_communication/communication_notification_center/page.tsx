import { ManagerCommunicationNotificationCenterMain } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/ManagerCommunicationNotificationCenterMain';
import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
import type { ManagerCommunicationNotificationCenterPageProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerCommunicationNotificationCenterPage({ searchParams }: ManagerCommunicationNotificationCenterPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerCommunicationNotificationCenterMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerCommunicationNotificationCenterMain {...mainProps} />;
}
