/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerCommunicationComplaintsSearchParams } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';
import type { ReactNode } from 'react';

export type ManagerCommunicationComplaintsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerCommunicationComplaintsPageProps = {
  searchParams?: Promise<ManagerCommunicationComplaintsSearchParams>;
};
