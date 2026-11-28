import type { AdminCommunicationNotificationCenterScenario } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';

/** Canonical isolated scenario bootstrap for notification-center tests. */
export const AdminCommunicationNotificationCenterScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type { AdminCommunicationNotificationCenterScenario };
