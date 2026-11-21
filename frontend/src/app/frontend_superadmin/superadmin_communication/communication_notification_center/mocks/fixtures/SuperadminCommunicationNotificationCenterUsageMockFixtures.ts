// RESPONSIBILITY: Notification usage analytics mock fixture.
// FLOW: Mocks -> UsageMockFixtures -> MSW handlers.

import type { NotificationUsageAnalytics } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

/** Usage analytics metrics fixture */
export const MOCK_USAGE_ANALYTICS: NotificationUsageAnalytics = {
  period: 'November 2026',
  totalDispatched: 28450,
  totalDelivered: 27980,
  totalFailed: 470,
  overallDeliveryRate: 98.35,
  activeAutomatedTriggersCount: 10,
  channels: {
    email: {
      channel: 'EMAIL',
      sentCount: 15200,
      deliveredCount: 15010,
      failedCount: 190,
      monthlyQuota: 50000,
      quotaUsedPercent: 30.4,
      deliverySuccessRate: 98.75,
      costInMinorUnits: 380000, // ₹3,800.00
    },
    sms: {
      channel: 'SMS',
      sentCount: 8150,
      deliveredCount: 7970,
      failedCount: 180,
      monthlyQuota: 20000,
      quotaUsedPercent: 40.75,
      deliverySuccessRate: 97.79,
      costInMinorUnits: 163000, // ₹1,630.00
    },
    whatsapp: {
      channel: 'WHATSAPP',
      sentCount: 5100,
      deliveredCount: 5000,
      failedCount: 100,
      monthlyQuota: 10000,
      quotaUsedPercent: 51.0,
      deliverySuccessRate: 98.04,
      costInMinorUnits: 255000, // ₹2,550.00
    },
  },
  dailyVolume: [
    { date: '2026-11-14', email: 1200, sms: 600, whatsapp: 380, failures: 32 },
    { date: '2026-11-15', email: 1100, sms: 550, whatsapp: 320, failures: 45 },
    { date: '2026-11-16', email: 1800, sms: 920, whatsapp: 590, failures: 55 },
    { date: '2026-11-17', email: 2100, sms: 1100, whatsapp: 710, failures: 62 },
    { date: '2026-11-18', email: 2300, sms: 1250, whatsapp: 840, failures: 78 },
    { date: '2026-11-19', email: 2900, sms: 1600, whatsapp: 1050, failures: 92 },
    { date: '2026-11-20', email: 3800, sms: 2130, whatsapp: 1210, failures: 106 },
  ],
  recentFailures: [
    {
      id: 'notif-rec-001',
      category: 'FAILED_PAYMENT_NOTIFICATION',
      channel: 'WHATSAPP',
      recipientName: 'Rajesh Varma',
      targetAccountName: 'Central Apex Library',
      failureReason: 'WhatsApp API: Recipient phone number unreachable or outside active session window',
      timestamp: '2026-11-20 10:15 IST',
      retryable: true,
    },
    {
      id: 'notif-rec-006',
      category: 'SECURITY_ALERT',
      channel: 'SMS',
      recipientName: 'Sunil Joshi',
      targetAccountName: 'Knowledge Hub Study Rooms',
      failureReason: 'SMS Gateway: DLT Template ID not approved for sender header',
      timestamp: '2026-11-18 09:12 IST',
      retryable: true,
    },
    {
      id: 'notif-rec-009',
      category: 'WELCOME_MESSAGE',
      channel: 'EMAIL',
      recipientName: 'Deepak Chopra',
      targetAccountName: 'Metro Digital Library & Coworking',
      failureReason: 'SMTP 550: 5.1.1 Requested action not taken: mailbox unavailable',
      timestamp: '2026-11-15 11:00 IST',
      retryable: true,
    },
  ],
};

