'use client';
import ManagerCommunicationComplaintsPage from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsPage';
import type { ManagerCommunicationComplaintsMainProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';

// RESPONSIBILITY: Preserve supported route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerCommunicationComplaintsMain(props: ManagerCommunicationComplaintsMainProps) {
  return <ManagerCommunicationComplaintsPage {...props} />;
}
