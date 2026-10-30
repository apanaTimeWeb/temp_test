import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/app/frontend_admin/lib/apiSchema";
import { ADMIN_COMMUNICATION_COMPLAINTS_API } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import { AdminCommunicationComplaintListSchema, AdminCommunicationNoticeListSchema } from "@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema";

export async function fetchAdminCommunicationComplaints() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_COMPLAINTS_API.COMPLAINTS);
  return parseApiResponseData(payload, AdminCommunicationComplaintListSchema);
}

export async function fetchAdminCommunicationNotices() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_COMPLAINTS_API.NOTICES);
  return parseApiResponseData(payload, AdminCommunicationNoticeListSchema);
}

/** Stable query-key namespace for admin_communication_complaints; declaration does not imply a live query is wired. */
export const adminCommunicationComplaintsQueryKeys = {
  all: ['admin_communication_complaints'] as const,
  lists: () => [...adminCommunicationComplaintsQueryKeys.all, 'lists'] as const,
  list: (filters: Readonly<Record<string, unknown>> = {}) => [...adminCommunicationComplaintsQueryKeys.lists(), filters] as const,
  details: () => [...adminCommunicationComplaintsQueryKeys.all, 'details'] as const,
  detail: (id: string) => [...adminCommunicationComplaintsQueryKeys.details(), id] as const,
} as const;
