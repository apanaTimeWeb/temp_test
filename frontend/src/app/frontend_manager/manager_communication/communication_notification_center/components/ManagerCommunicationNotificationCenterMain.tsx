'use client';
import ManagerCommunicationNotificationCenterPage from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_views/ManagerCommunicationNotificationCenterPage.tsx';
import type { ManagerCommunicationNotificationCenterMainProps } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';

// RESPONSIBILITY: Preserve supported route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerCommunicationNotificationCenterMain(props: ManagerCommunicationNotificationCenterMainProps) {
  return <ManagerCommunicationNotificationCenterPage {...props} />;
}
