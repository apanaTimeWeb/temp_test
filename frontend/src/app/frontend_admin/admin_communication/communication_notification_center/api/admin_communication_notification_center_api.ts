import { ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';
import { AdminCommunicationComplaintListSchema,AdminCommunicationNoticeListSchema } from '@/app/frontend_admin/admin_communication/communication_notification_center/schemas/AdminCommunicationNotificationCenterApiSchema';
import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';

export async function fetchAdminCommunicationComplaints() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.COMPLAINTS);
  return parseApiResponseData(payload, AdminCommunicationComplaintListSchema);
}

export async function fetchAdminCommunicationNotices() {
  const payload = await apiFetch<unknown>(ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.NOTICES);
  return parseApiResponseData(payload, AdminCommunicationNoticeListSchema);
}
