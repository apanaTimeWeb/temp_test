/** Canonical isolated scenario bootstrap for notification-center tests. */
export const AdminCommunicationNotificationCenterScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminCommunicationNotificationCenterScenario = (typeof AdminCommunicationNotificationCenterScenarios)[number];
