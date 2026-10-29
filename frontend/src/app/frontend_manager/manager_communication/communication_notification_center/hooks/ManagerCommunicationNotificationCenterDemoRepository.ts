/** Module-owned sample-only repository for notification history. */
import type { ManagerCommunicationNotificationCenterNotificationHistoryRow as NotificationHistoryFixture } from '@/app/frontend_manager/manager_communication/communication_notification_center/mocks/manager_communication_notification_center_fixtures/ManagerCommunicationNotificationCenterOperationalSampleFixtures';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY as NotificationHistorySource } from '@/app/frontend_manager/manager_communication/communication_notification_center/mocks/manager_communication_notification_center_fixtures/ManagerCommunicationNotificationCenterOperationalSampleFixtures';

export type ManagerCommunicationNotificationCenterNotificationHistoryRow = NotificationHistoryFixture;
export const MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY = NotificationHistorySource.map((record) => ({ ...record }));
