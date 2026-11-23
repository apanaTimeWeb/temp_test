import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API } from '../config/superadmin_communication_notification_center.url_config';
import type {
  NotificationTargetAccount,
  NotificationTemplate,
  NotificationUsageAnalytics,
} from '../types/SuperadminCommunicationNotificationCenterNotificationTypes';
import { apiFetch, type ApiResponse } from '@/lib/api';
import {
  getFallbackAccounts,
  getFallbackTemplates,
  getFallbackUsage,
  updateFallbackTemplate,
} from './superadmin_communication_notification_center.store';
import { SUPERADMINCOMMUNICATIONNOTIFICATIONCENTER_API_CONTRACT_STATUS } from './superadmin_communication_notification_center.api';

const shouldCallNetwork = () =>
  SUPERADMINCOMMUNICATIONNOTIFICATIONCENTER_API_CONTRACT_STATUS.networkCallsEnabled &&
  Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

/** Fetch all 10 mandated notification templates */
export async function fetchSuperadminNotificationTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
  if (shouldCallNetwork()) {
    try {
      const res = await apiFetch<NotificationTemplate[]>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.templates, {
        method: 'GET',
      });
      if (res && res.success && res.data) return res;
    } catch {
      // Fallback to in-memory store
    }
  }

  return {
    data: getFallbackTemplates(),
    requestId: 'preview-templates',
    success: true,
    message: 'Templates loaded successfully',
  };
}

/** Update a notification template with Idempotency-Key */
export async function updateSuperadminNotificationTemplate(
  id: string,
  payload: Partial<NotificationTemplate>,
  _idempotencyKey: string
): Promise<ApiResponse<NotificationTemplate>> {
  if (shouldCallNetwork()) {
    try {
      const res = await apiFetch<NotificationTemplate>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.updateTemplate(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': _idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      if (res && res.success && res.data) return res;
    } catch {
      // Fallback to in-memory store
    }
  }

  return {
    data: updateFallbackTemplate(id, payload),
    requestId: _idempotencyKey,
    success: true,
    message: 'Template updated successfully',
  };
}

/** Fetch notification channel usage & delivery analytics */
export async function fetchSuperadminNotificationUsage(): Promise<ApiResponse<NotificationUsageAnalytics>> {
  if (shouldCallNetwork()) {
    try {
      const res = await apiFetch<NotificationUsageAnalytics>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.usage, {
        method: 'GET',
      });
      if (res && res.success && res.data) return res;
    } catch {
      // Fallback to in-memory store
    }
  }

  return {
    data: getFallbackUsage(),
    requestId: 'preview-usage',
    success: true,
    message: 'Usage analytics loaded',
  };
}

/** Fetch pre-configured library accounts for account-specific dispatch */
export async function fetchSuperadminTargetAccounts(): Promise<ApiResponse<NotificationTargetAccount[]>> {
  if (shouldCallNetwork()) {
    try {
      const res = await apiFetch<NotificationTargetAccount[]>(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.accounts, {
        method: 'GET',
      });
      if (res && res.success && res.data) return res;
    } catch {
      // Fallback to in-memory store
    }
  }

  return {
    data: getFallbackAccounts(),
    requestId: 'preview-accounts',
    success: true,
    message: 'Accounts loaded',
  };
}
