import type { ManagerCommunicationComplaintsComplaintStatus } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';

/** Stable status filters for the complaints feature. */
export const MANAGER_COMMUNICATION_COMPLAINT_TABS: Array<ManagerCommunicationComplaintsComplaintStatus | 'All'> = ['All', 'Open', 'In-Progress', 'Resolved'];
