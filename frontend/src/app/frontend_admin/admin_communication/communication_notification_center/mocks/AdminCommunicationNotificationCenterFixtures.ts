import type { AdminCommunicationNotification } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';
import { ADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES as ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';

/** Synthetic preview records only. These are not fetched notification-service records. */
export const ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES: AdminCommunicationNotification[] = [
  { id: '1', category: 'Finance', icon: '💰', titleKey: 'SAMPLE_SUBSCRIPTIONS_EXPIRE_TITLE', descriptionKey: 'SAMPLE_SUBSCRIPTIONS_EXPIRE_DESCRIPTION', timeKey: 'TIME_TWO_HOURS_AGO', priority: 'High', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_RENEWALS, read: false },
  { id: '2', category: 'CRM', icon: '📞', titleKey: 'SAMPLE_CRM_FOLLOWUP_TITLE', descriptionKey: 'SAMPLE_CRM_FOLLOWUP_DESCRIPTION', timeKey: 'TIME_THREE_HOURS_AGO', priority: 'Medium', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.CRM_ENQUIRIES, read: false },
  { id: '3', category: 'Finance', icon: '🤝', titleKey: 'SAMPLE_PAYMENT_PROMISES_TITLE', descriptionKey: 'SAMPLE_PAYMENT_PROMISES_DESCRIPTION', timeKey: 'TIME_FOUR_HOURS_AGO', priority: 'High', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_PAYMENT_PROMISES, read: false },
  { id: '4', category: 'Operations', icon: '🪑', titleKey: 'SAMPLE_SEAT_MAINTENANCE_TITLE', descriptionKey: 'SAMPLE_SEAT_MAINTENANCE_DESCRIPTION', timeKey: 'TIME_ONE_DAY_AGO', priority: 'Medium', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.SEAT_MAINTENANCE, read: false },
  { id: '5', category: 'Attendance', icon: '📅', titleKey: 'SAMPLE_ATTENDANCE_ALERT_TITLE', descriptionKey: 'SAMPLE_ATTENDANCE_ALERT_DESCRIPTION', timeKey: 'TIME_ONE_DAY_AGO', priority: 'High', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.REPORTS, read: false },
  { id: '6', category: 'Finance', icon: '⏰', titleKey: 'SAMPLE_LATE_FEES_TITLE', descriptionKey: 'SAMPLE_LATE_FEES_DESCRIPTION', timeKey: 'TIME_TWO_DAYS_AGO', priority: 'Medium', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.FINANCE_LATE_FEES, read: true },
  { id: '7', category: 'Operations', icon: '🔒', titleKey: 'SAMPLE_LOCKER_ISSUE_TITLE', descriptionKey: 'SAMPLE_LOCKER_ISSUE_DESCRIPTION', timeKey: 'TIME_THREE_DAYS_AGO', priority: 'Medium', link: ADMIN_COMMUNICATION_NOTIFICATION_TARGET_ROUTES.SEAT_MAINTENANCE, read: true },
];
