import type { AdminCommunicationNotificationCenterScenario } from '@/app/frontend_admin/admin_communication/communication_notification_center/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** Communication-owned types for notification-center data and filter state. */
export type AdminCommunicationNotificationCategory = 'All' | 'Finance' | 'CRM' | 'Operations' | 'Attendance' | 'High Only';
export type AdminCommunicationNotificationDomain = Exclude<AdminCommunicationNotificationCategory, 'All' | 'High Only'>;
export type AdminCommunicationNotificationPriority = 'High' | 'Medium';
export type AdminCommunicationNotificationMessageKey =
  | 'SAMPLE_SUBSCRIPTIONS_EXPIRE_TITLE' | 'SAMPLE_SUBSCRIPTIONS_EXPIRE_DESCRIPTION'
  | 'SAMPLE_CRM_FOLLOWUP_TITLE' | 'SAMPLE_CRM_FOLLOWUP_DESCRIPTION'
  | 'SAMPLE_PAYMENT_PROMISES_TITLE' | 'SAMPLE_PAYMENT_PROMISES_DESCRIPTION'
  | 'SAMPLE_SEAT_MAINTENANCE_TITLE' | 'SAMPLE_SEAT_MAINTENANCE_DESCRIPTION'
  | 'SAMPLE_ATTENDANCE_ALERT_TITLE' | 'SAMPLE_ATTENDANCE_ALERT_DESCRIPTION'
  | 'SAMPLE_LATE_FEES_TITLE' | 'SAMPLE_LATE_FEES_DESCRIPTION'
  | 'SAMPLE_LOCKER_ISSUE_TITLE' | 'SAMPLE_LOCKER_ISSUE_DESCRIPTION'
  | 'TIME_TWO_HOURS_AGO' | 'TIME_THREE_HOURS_AGO' | 'TIME_FOUR_HOURS_AGO'
  | 'TIME_ONE_DAY_AGO' | 'TIME_TWO_DAYS_AGO' | 'TIME_THREE_DAYS_AGO';

export interface AdminCommunicationNotification {
  id: string;
  category: AdminCommunicationNotificationDomain;
  icon: string;
  titleKey: AdminCommunicationNotificationMessageKey;
  descriptionKey: AdminCommunicationNotificationMessageKey;
  timeKey: AdminCommunicationNotificationMessageKey;
  priority: AdminCommunicationNotificationPriority;
  link: string;
  read: boolean;
}

export interface AdminCommunicationNotificationCenterHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationNotificationCenterScenario;
}
