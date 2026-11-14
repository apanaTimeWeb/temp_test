// FLOW: Feature consumers -> superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Communication Notification Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminCommunicationNotificationFilter } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

/**
 * Defines the public SuperadminCommunicationNotificationCategoryOption contract for communication notification center. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: SuperadminCommunicationNotificationFilter.
 * @property labelKey Display label for the owning feature. Declared type: string.
 * @property icon Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminCommunicationNotificationCategoryOption {
  id: SuperadminCommunicationNotificationFilter;
  labelKey: string;
  icon: string;
}

export const SUPERADMIN_COMMUNICATION_NOTIFICATION_FILTERS: SuperadminCommunicationNotificationCategoryOption[] = [
  { id: 'All', labelKey: 'COPY.NOTIFICATION_CATEGORY_ALL', icon: '🔔' },
  { id: 'Finance', labelKey: 'COPY.NOTIFICATION_CATEGORY_FINANCE', icon: '💰' },
  { id: 'CRM', labelKey: 'COPY.NOTIFICATION_CATEGORY_CRM', icon: '📞' },
  { id: 'Operations', labelKey: 'COPY.NOTIFICATION_CATEGORY_OPERATIONS', icon: '🪑' },
  { id: 'Attendance', labelKey: 'COPY.NOTIFICATION_CATEGORY_ATTENDANCE', icon: '📅' },
  { id: 'High Only', labelKey: 'COPY.NOTIFICATION_CATEGORY_HIGH_ONLY', icon: '🔴' },
];

export const SUPERADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS: Readonly<Record<string, string>> = {
  Finance: 'eng-notif-icon--finance',
  CRM: 'eng-notif-icon--crm',
  Operations: 'eng-notif-icon--ops',
  Attendance: 'eng-notif-icon--attend',
};
