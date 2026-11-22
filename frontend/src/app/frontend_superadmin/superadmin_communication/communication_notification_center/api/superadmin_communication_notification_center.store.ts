// RESPONSIBILITY: Isolated in-memory fallback store and state operations for standalone preview mode.
// FLOW: api -> store.ts -> in-memory records.

import {
  MANDATED_NOTIFICATION_TEMPLATES,
  TARGET_LIBRARY_ACCOUNTS,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import { MOCK_NOTIFICATION_RECORDS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/mocks/fixtures/SuperadminCommunicationNotificationCenterNotificationMockFixtures';
import { MOCK_USAGE_ANALYTICS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/mocks/fixtures/SuperadminCommunicationNotificationCenterUsageMockFixtures';
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

let fallbackNotifications: NotificationRecord[] = [...MOCK_NOTIFICATION_RECORDS];
let fallbackTemplates: NotificationTemplate[] = [...MANDATED_NOTIFICATION_TEMPLATES];
let fallbackUsage: NotificationUsageAnalytics = JSON.parse(JSON.stringify(MOCK_USAGE_ANALYTICS));
const fallbackAccounts: NotificationTargetAccount[] = [...TARGET_LIBRARY_ACCOUNTS];

export function getFallbackUsage(): NotificationUsageAnalytics {
  return fallbackUsage;
}

export function getFallbackAccounts(): NotificationTargetAccount[] {
  return fallbackAccounts;
}

export function getFallbackTemplates(): NotificationTemplate[] {
  return fallbackTemplates;
}

export function filterFallbackNotifications(params: NotificationFilterParams = {}): NotificationRecord[] {
  let list = [...fallbackNotifications];
  if (params.category && params.category !== 'ALL' && params.category !== 'All') {
    list = list.filter((n) => n.category === params.category);
  }
  if (params.channel && params.channel !== 'ALL' && params.channel !== 'All') {
    list = list.filter((n) => n.channels.includes(params.channel as never));
  }
  if (params.status && params.status !== 'ALL' && params.status !== 'All') {
    list = list.filter((n) => n.status === params.status);
  }
  if (params.targetScope && params.targetScope !== 'ALL' && params.targetScope !== 'All') {
    list = list.filter((n) => n.targetScope === params.targetScope);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    list = list.filter((n) =>
      n.title.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q) ||
      n.targetRecipient.name.toLowerCase().includes(q) ||
      (n.targetAccount?.name.toLowerCase().includes(q) ?? false)
    );
  }
  return list;
}

export function dispatchFallbackNotification(
  dto: DispatchNotificationDto,
  idempotencyKey: string
): NotificationRecord {
  const targetAccount = dto.targetAccountId
    ? fallbackAccounts.find((a) => a.id === dto.targetAccountId) ?? null
    : null;

  const newRecord: NotificationRecord = {
    id: `notif-disp-${Date.now()}`,
    category: dto.category,
    title: dto.title,
    message: dto.message,
    targetScope: dto.targetScope,
    targetAccount,
    targetRecipient: {
      name: dto.testRecipient?.email ? `Test (${dto.testRecipient.email})` : 'All Subscribed Admins',
      email: dto.testRecipient?.email,
      phone: dto.testRecipient?.phone,
      role: dto.targetRole ?? 'ALL_ROLES',
    },
    channels: dto.channels,
    priority: dto.priority ?? 'NORMAL',
    status: 'SENT',
    failureReason: null,
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    deliveredAt: new Date().toISOString(),
    lastRetryAt: null,
    idempotencyKey,
    read: false,
  };

  fallbackNotifications = [newRecord, ...fallbackNotifications];
  fallbackUsage.totalDispatched += 1;
  fallbackUsage.totalDelivered += 1;

  for (const ch of dto.channels) {
    if (ch === 'EMAIL') fallbackUsage.channels.email.sentCount += 1;
    if (ch === 'SMS') fallbackUsage.channels.sms.sentCount += 1;
    if (ch === 'WHATSAPP') fallbackUsage.channels.whatsapp.sentCount += 1;
  }

  return newRecord;
}

export function retryFallbackNotification(id: string, idempotencyKey: string): NotificationRecord {
  const existingIdx = fallbackNotifications.findIndex((n) => n.id === id);
  if (existingIdx !== -1) {
    const prev = fallbackNotifications[existingIdx];
    const updated: NotificationRecord = {
      ...prev,
      status: 'DELIVERED',
      failureReason: null,
      retryCount: prev.retryCount + 1,
      lastRetryAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      idempotencyKey,
    };
    fallbackNotifications[existingIdx] = updated;

    if (fallbackUsage.totalFailed > 0) fallbackUsage.totalFailed -= 1;
    fallbackUsage.totalDelivered += 1;
    return updated;
  }
  throw new Error(`Notification ${id} not found in store`);
}

export function updateFallbackTemplate(
  id: string,
  payload: Partial<NotificationTemplate>
): NotificationTemplate {
  const idx = fallbackTemplates.findIndex((t) => t.id === id);
  if (idx !== -1) {
    fallbackTemplates[idx] = {
      ...fallbackTemplates[idx],
      ...payload,
      lastModified: new Date().toISOString().split('T')[0],
    };
    return fallbackTemplates[idx];
  }
  throw new Error(`Template ${id} not found`);
}
