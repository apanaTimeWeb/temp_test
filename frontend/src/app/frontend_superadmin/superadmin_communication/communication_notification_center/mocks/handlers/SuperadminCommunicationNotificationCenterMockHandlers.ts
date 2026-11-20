// RESPONSIBILITY: MSW request handlers for Superadmin Notification & Communication Center.
// FLOW: Network calls in test/dev -> MSW -> ApiResponse<T> canonical envelopes.

import { http, HttpResponse } from 'msw';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/config/superadmin_communication_notification_center.url_config';
import {
  MOCK_NOTIFICATION_RECORDS,
  MOCK_NOTIFICATION_TEMPLATES,
  MOCK_TARGET_ACCOUNTS,
  MOCK_USAGE_ANALYTICS,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/mocks/fixtures/SuperadminCommunicationNotificationCenterNotificationMockFixtures';
import type {
  DispatchNotificationDto,
  NotificationRecord,
  NotificationTemplate,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

// In-memory mutable state for testing/interactive preview
let notificationsStore = [...MOCK_NOTIFICATION_RECORDS];
let templatesStore = [...MOCK_NOTIFICATION_TEMPLATES];

export function resetMockNotificationsStore() {
  notificationsStore = [...MOCK_NOTIFICATION_RECORDS];
  templatesStore = [...MOCK_NOTIFICATION_TEMPLATES];
}

export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_MSW_HANDLERS = [
  // 1. List notifications with filtering
  http.get(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.list, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const channel = url.searchParams.get('channel');
    const status = url.searchParams.get('status');
    const targetScope = url.searchParams.get('targetScope');
    const search = url.searchParams.get('search')?.toLowerCase();

    let items = [...notificationsStore];

    if (category && category !== 'All') {
      items = items.filter((n) => n.category === category);
    }
    if (channel && channel !== 'All') {
      items = items.filter((n) => n.channels.includes(channel as never));
    }
    if (status && status !== 'All') {
      items = items.filter((n) => n.status === status);
    }
    if (targetScope && targetScope !== 'All') {
      items = items.filter((n) => n.targetScope === targetScope);
    }
    if (search) {
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(search) ||
          n.message.toLowerCase().includes(search) ||
          n.targetRecipient.name.toLowerCase().includes(search) ||
          (n.targetAccount?.name.toLowerCase().includes(search) ?? false)
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Notifications fetched successfully',
      data: items,
      meta: {
        total: items.length,
        page: 1,
        limit: 50,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      requestId: `req-list-${Date.now()}`,
    });
  }),

  // 2. Dispatch a notification
  http.post(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.dispatch, async ({ request }) => {
    const body = (await request.json()) as DispatchNotificationDto;
    const idempotencyKey = request.headers.get('Idempotency-Key') ?? `idemp-${Date.now()}`;

    const targetAccount = body.targetAccountId
      ? MOCK_TARGET_ACCOUNTS.find((a) => a.id === body.targetAccountId) ?? null
      : null;

    const newRecord: NotificationRecord = {
      id: `notif-rec-${Date.now()}`,
      category: body.category,
      title: body.title,
      message: body.message,
      targetScope: body.targetScope,
      targetAccount,
      targetRecipient: {
        name: body.testRecipient?.email
          ? `Test (${body.testRecipient.email})`
          : targetAccount
            ? `${targetAccount.name} Administrator`
            : 'All Targeted Administrators',
        email: body.testRecipient?.email ?? targetAccount?.email,
        phone: body.testRecipient?.phone ?? targetAccount?.phone,
        role: body.targetRole,
      },
      channels: body.channels,
      priority: body.priority,
      status: 'SENT',
      failureReason: null,
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      lastRetryAt: null,
      idempotencyKey,
      read: false,
    };

    notificationsStore.unshift(newRecord);

    return HttpResponse.json({
      success: true,
      message: 'Notification queued and dispatched successfully',
      data: newRecord,
      requestId: `req-dispatch-${Date.now()}`,
    });
  }),

  // 3. Retry a failed notification
  http.post('/api/v1/superadmin/communication/notifications/:id/retry', ({ params }) => {
    const { id } = params;
    const record = notificationsStore.find((n) => n.id === id);

    if (!record) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Notification not found',
          data: null,
          errorCode: 'NOT_FOUND',
          statusCode: 404,
          requestId: `req-retry-err-${Date.now()}`,
        },
        { status: 404 }
      );
    }

    // Simulate successful retry
    record.status = 'DELIVERED';
    record.failureReason = null;
    record.retryCount += 1;
    record.lastRetryAt = new Date().toISOString();
    record.deliveredAt = new Date().toISOString();

    return HttpResponse.json({
      success: true,
      message: `Transmission retried successfully for ${record.targetRecipient.name}. Delivery confirmed.`,
      data: record,
      requestId: `req-retry-succ-${Date.now()}`,
    });
  }),

  // 4. Fetch templates
  http.get(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.templates, () => {
    return HttpResponse.json({
      success: true,
      message: 'Templates fetched successfully',
      data: templatesStore,
      requestId: `req-tmpl-${Date.now()}`,
    });
  }),

  // 5. Update template
  http.patch('/api/v1/superadmin/communication/templates/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<NotificationTemplate>;
    const tmplIndex = templatesStore.findIndex((t) => t.id === id);

    if (tmplIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Template not found',
          data: null,
          errorCode: 'NOT_FOUND',
          statusCode: 404,
          requestId: `req-tmpl-err-${Date.now()}`,
        },
        { status: 404 }
      );
    }

    templatesStore[tmplIndex] = {
      ...templatesStore[tmplIndex],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0] ?? '2026-11-20',
      modifiedBy: 'SuperAdmin Operator',
    };

    return HttpResponse.json({
      success: true,
      message: 'Template updated successfully',
      data: templatesStore[tmplIndex],
      requestId: `req-tmpl-succ-${Date.now()}`,
    });
  }),

  // 6. Fetch usage analytics
  http.get(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.usage, () => {
    return HttpResponse.json({
      success: true,
      message: 'Usage analytics fetched successfully',
      data: MOCK_USAGE_ANALYTICS,
      requestId: `req-usage-${Date.now()}`,
    });
  }),

  // 7. Fetch target accounts
  http.get(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_API.accounts, () => {
    return HttpResponse.json({
      success: true,
      message: 'Target library accounts fetched successfully',
      data: MOCK_TARGET_ACCOUNTS,
      requestId: `req-acc-${Date.now()}`,
    });
  }),
];
