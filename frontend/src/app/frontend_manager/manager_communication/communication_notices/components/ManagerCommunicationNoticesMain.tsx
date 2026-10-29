'use client';
import ManagerCommunicationNoticesPage from '@/app/frontend_manager/manager_communication/communication_notices/components/manager_communication_notices_views/ManagerCommunicationNoticesPage.tsx';
import type { ManagerCommunicationNoticesMainProps } from '@/app/frontend_manager/manager_communication/communication_notices/types/ManagerCommunicationNoticesMainTypes';

// RESPONSIBILITY: Preserve supported route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerCommunicationNoticesMain(props: ManagerCommunicationNoticesMainProps) {
  return <ManagerCommunicationNoticesPage {...props} />;
}
