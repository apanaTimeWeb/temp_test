// RESPONSIBILITY: API methods for Superadmin Notification & Communication Center.
// FLOW: Components/hooks -> api/superadmin_communication_notification_center.api.ts -> @/lib/api -> ApiResponse<T>.

import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/config/superadmin_communication_notification_center.url_config';
import type {
  DispatchNotificationDto,
  NotificationRecord,
  NotificationTargetAccount,
  NotificationTemplate,
  NotificationUsageAnalytics,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export interface NotificationFilterParams {
  category?: string;
  channel?: string;
  status?: string;
  targetScope?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/** Fetch paginated notifications with filters */
export async function fetchSuperadminNotifications(
  params: NotificationFilterParams = {}
): Promise<ApiResponse<NotificationRecord[]>> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.channel && params.channel !== 'All') query.set('channel', params.channel);
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.targetScope && params.targetScope !== 'All') query.set('targetScope', params.targetScope);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const endpoint = qs ? `${SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.list}?${qs}` : SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.list;
  return apiFetch<NotificationRecord[]>(endpoint, { method: 'GET' });
}

/** Dispatch a new global or account-specific notification with Idempotency-Key */
export async function dispatchSuperadminNotification(
  dto: DispatchNotificationDto,
  idempotencyKey: string
): Promise<ApiResponse<NotificationRecord>> {
  return apiFetch<NotificationRecord>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.dispatch, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(dto),
  });
}

/** Retry a failed notification transmission with Idempotency-Key */
export async function retrySuperadminNotification(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<NotificationRecord>> {
  return apiFetch<NotificationRecord>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.retry(id), {
    method: 'POST',
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });
}

/** Fetch all 10 mandated notification templates */
export async function fetchSuperadminNotificationTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
  return apiFetch<NotificationTemplate[]>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.templates, {
    method: 'GET',
  });
}

/** Update a notification template with Idempotency-Key */
export async function updateSuperadminNotificationTemplate(
  id: string,
  payload: Partial<NotificationTemplate>,
  idempotencyKey: string
): Promise<ApiResponse<NotificationTemplate>> {
  return apiFetch<NotificationTemplate>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.updateTemplate(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}

/** Fetch notification channel usage & delivery analytics */
export async function fetchSuperadminNotificationUsage(): Promise<ApiResponse<NotificationUsageAnalytics>> {
  return apiFetch<NotificationUsageAnalytics>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.usage, {
    method: 'GET',
  });
}

/** Fetch pre-configured library accounts for account-specific dispatch */
export async function fetchSuperadminTargetAccounts(): Promise<ApiResponse<NotificationTargetAccount[]>> {
  return apiFetch<NotificationTargetAccount[]>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.accounts, {
    method: 'GET',
  });
}

/** Legacy contract marker retained for backward compatibility */
export const SUPERADMINCOMMUNICATIONNOTIFICATIONCENTER_API_CONTRACT_STATUS = {
  status: 'unavailable',
  requiredInputs: ['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract'],
  source: 'SUPPLIED_FRONTEND_ARCHIVE',
  networkCallsEnabled: false,
  reason: 'Verified API contract supplied via WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.',
} as const;
