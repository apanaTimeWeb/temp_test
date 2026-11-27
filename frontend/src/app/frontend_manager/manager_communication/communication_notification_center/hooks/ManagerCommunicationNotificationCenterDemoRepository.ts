import {
  MANAGER_COMMUNICATION_DEMO_NOTIFICATION_HISTORY,
  type ManagerCommunicationNotificationCenterDemoHistoryRow,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/config/manager_communication_notification_center.demo_data';

/** Module-owned sample-only repository detached from test-only mocks. */
export type ManagerCommunicationNotificationCenterNotificationHistoryRow = ManagerCommunicationNotificationCenterDemoHistoryRow;

export const MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY =
  MANAGER_COMMUNICATION_DEMO_NOTIFICATION_HISTORY.map((record) => ({ ...record }));
