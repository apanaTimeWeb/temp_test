// RESPONSIBILITY: Verify all mandated requirements for Superadmin Notifications & Communication.
// FLOW: Test runner -> tests/SuperadminCommunicationNotificationCenterMandatedRequirements.test.ts -> assertions on templates, channels, delivery statuses, retry & usage tracking.

import { describe, expect, it } from 'vitest';
import {
  MANDATED_NOTIFICATION_TEMPLATES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUS_CONFIG,
  TARGET_LIBRARY_ACCOUNTS,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import {
  MOCK_NOTIFICATION_RECORDS,
  MOCK_USAGE_ANALYTICS,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/mocks/fixtures/SuperadminCommunicationNotificationCenterNotificationMockFixtures';
import { dispatchNotificationSchema } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/schemas/SuperadminCommunicationNotificationCenterSchemas';
import type { NotificationCategory } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

describe('Superadmin Notifications & Communication Mandated Feature Suite', () => {
  const REQUIRED_CATEGORIES: NotificationCategory[] = [
    'ADMIN_INVITATION',
    'WELCOME_MESSAGE',
    'SUBSCRIPTION_EXPIRY_REMINDER',
    'PAYMENT_REMINDER',
    'FAILED_PAYMENT_NOTIFICATION',
    'BRANCH_CREATION_CONFIRMATION',
    'MAINTENANCE_ALERT',
    'SYSTEM_OUTAGE_NOTIFICATION',
    'SECURITY_ALERT',
    'PRODUCT_ANNOUNCEMENT',
  ];

  it('1. contains all 10 mandated notification templates with valid definitions', () => {
    expect(MANDATED_NOTIFICATION_TEMPLATES).toHaveLength(10);
    const categoriesInCatalog = MANDATED_NOTIFICATION_TEMPLATES.map((t) => t.category);

    for (const reqCat of REQUIRED_CATEGORIES) {
      expect(categoriesInCatalog).toContain(reqCat);
    }
  });

  it('2. supports all 3 communication channels: Email, SMS, and WhatsApp with template mappings', () => {
    const channelIds = NOTIFICATION_CHANNELS.map((c) => c.id);
    expect(channelIds).toEqual(['EMAIL', 'SMS', 'WHATSAPP']);

    for (const template of MANDATED_NOTIFICATION_TEMPLATES) {
      expect(template.channelTemplates).toBeDefined();
      expect(template.channelTemplates.email).toBeDefined();
      expect(template.channelTemplates.sms).toBeDefined();
      expect(template.channelTemplates.whatsapp).toBeDefined();
      expect(template.variables.length).toBeGreaterThan(0);
    }
  });

  it('3. enforces Global and Account-Specific targeting capabilities', () => {
    expect(TARGET_LIBRARY_ACCOUNTS.length).toBeGreaterThanOrEqual(3);

    const globalRecords = MOCK_NOTIFICATION_RECORDS.filter((r) => r.targetScope === 'GLOBAL');
    const accountRecords = MOCK_NOTIFICATION_RECORDS.filter((r) => r.targetScope === 'ACCOUNT_SPECIFIC');

    expect(globalRecords.length).toBeGreaterThan(0);
    expect(accountRecords.length).toBeGreaterThan(0);

    for (const accRec of accountRecords) {
      expect(accRec.targetAccount).toBeDefined();
      expect(accRec.targetAccount?.name).toBeDefined();
    }
  });

  it('4. tracks delivery status (Delivered, Sent, Pending, Failed, Bounced) and includes failure reason', () => {
    const statuses = Object.keys(NOTIFICATION_STATUS_CONFIG);
    expect(statuses).toContain('DELIVERED');
    expect(statuses).toContain('SENT');
    expect(statuses).toContain('PENDING');
    expect(statuses).toContain('FAILED');
    expect(statuses).toContain('BOUNCED');

    const failedRecords = MOCK_NOTIFICATION_RECORDS.filter(
      (r) => r.status === 'FAILED' || r.status === 'BOUNCED'
    );
    expect(failedRecords.length).toBeGreaterThan(0);

    for (const rec of failedRecords) {
      expect(rec.failureReason).toBeTruthy();
      expect(typeof rec.failureReason).toBe('string');
      expect(rec.retryCount).toBeGreaterThanOrEqual(0);
      expect(rec.maxRetries).toBeGreaterThan(0);
    }
  });

  it('5. provides usage tracking & quota monitoring across all 3 channels', () => {
    expect(MOCK_USAGE_ANALYTICS).toBeDefined();
    expect(MOCK_USAGE_ANALYTICS.totalDispatched).toBeGreaterThan(0);
    expect(MOCK_USAGE_ANALYTICS.overallDeliveryRate).toBeGreaterThan(90);

    expect(MOCK_USAGE_ANALYTICS.channels.email.monthlyQuota).toBe(50000);
    expect(MOCK_USAGE_ANALYTICS.channels.sms.monthlyQuota).toBe(20000);
    expect(MOCK_USAGE_ANALYTICS.channels.whatsapp.monthlyQuota).toBe(10000);

    expect(MOCK_USAGE_ANALYTICS.channels.email.deliverySuccessRate).toBeGreaterThan(95);
    expect(MOCK_USAGE_ANALYTICS.channels.sms.deliverySuccessRate).toBeGreaterThan(95);
    expect(MOCK_USAGE_ANALYTICS.channels.whatsapp.deliverySuccessRate).toBeGreaterThan(95);
  });

  it('6. validates dispatch notification inputs using strict Zod schema', () => {
    const validGlobalPayload = {
      category: 'MAINTENANCE_ALERT' as const,
      title: 'Scheduled System Maintenance',
      message: 'Platform will undergo maintenance from 02:00 to 04:00 AM IST.',
      targetScope: 'GLOBAL' as const,
      channels: ['EMAIL' as const, 'SMS' as const],
      priority: 'HIGH' as const,
      targetRole: 'ALL_ROLES' as const,
    };

    const parsed = dispatchNotificationSchema.safeParse(validGlobalPayload);
    expect(parsed.success).toBe(true);

    const invalidPayloadNoChannel = {
      ...validGlobalPayload,
      channels: [],
    };
    const invalidParsed = dispatchNotificationSchema.safeParse(invalidPayloadNoChannel);
    expect(invalidParsed.success).toBe(false);
  });
});
