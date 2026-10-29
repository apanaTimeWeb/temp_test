import { apiFetch } from '@/lib/api';
import { MANAGER_COMMUNICATION_COMPLAINTS_URL } from '@/app/frontend_manager/manager_communication/communication_complaints/config/manager_communication_complaints.url_config';
import { managerComplaintsComplaintResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_complaints/schemas/ManagerCommunicationComplaintsSchema';
import type { ManagerCommunicationComplaintsComplaint } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';

function toValidatedCalendarDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new Error('Complaint API returned an invalid createdAt date.');
  }
  return date.toISOString().slice(0, 10);
}

export async function fetchManagerCommunicationComplaints(): Promise<ManagerCommunicationComplaintsComplaint[]> {
  const response = await apiFetch<unknown>(MANAGER_COMMUNICATION_COMPLAINTS_URL);
  if (!response.success) {
    throw new Error(response.message || 'Unable to load complaints.');
  }

  const raw = managerComplaintsComplaintResponseListSchema.parse(response.data);
  return raw.map((item) => ({
    id: item.id,
    title: item.subject,
    student: null,
    description: item.description,
    status: item.status === 'open' ? 'Open' : item.status === 'resolved' ? 'Resolved' : 'In-Progress',
    date: toValidatedCalendarDate(item.createdAt),
    resolvedBy: null,
    resolvedDate: null,
    resolvedNote: null,
  }));
}
