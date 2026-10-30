import { apiFetch } from "@/app/frontend_admin/lib/api";
import { parseApiResponseData } from "@/app/frontend_admin/lib/apiSchema";
import { ADMIN_COMMUNICATION_URLS } from "@/app/frontend_admin/admin_communication/communication_notices/config/admin_communication_notices_communication_url_config_source_routes";
import { AdminCommunicationComplaintListSchema, AdminCommunicationNoticeListSchema } from "@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema";

export async function fetchAdminCommunicationComplaints() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_URLS.COMPLAINTS);
  return parseApiResponseData(payload, AdminCommunicationComplaintListSchema);
}

export async function fetchAdminCommunicationNotices() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_URLS.NOTICES);
  return parseApiResponseData(payload, AdminCommunicationNoticeListSchema);
}

/** Stable query-key namespace for admin_communication_notices; declaration does not imply a live query is wired. */
export const adminCommunicationNoticesQueryKeys = {
  all: ['admin_communication_notices'] as const,
  lists: () => [...adminCommunicationNoticesQueryKeys.all, 'lists'] as const,
  list: (filters: Readonly<Record<string, unknown>> = {}) => [...adminCommunicationNoticesQueryKeys.lists(), filters] as const,
  details: () => [...adminCommunicationNoticesQueryKeys.all, 'details'] as const,
  detail: (id: string) => [...adminCommunicationNoticesQueryKeys.details(), id] as const,
} as const;
