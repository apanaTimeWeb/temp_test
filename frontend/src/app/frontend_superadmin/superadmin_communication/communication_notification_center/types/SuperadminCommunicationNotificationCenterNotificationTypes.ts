// FLOW: Feature source -> superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Communication Notification Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminCommunicationNotificationCategory = 'Finance' | 'CRM' | 'Operations' | 'Attendance';
/**
 * Defines the public SuperadminCommunicationNotificationPriority contract for communication notification center. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminCommunicationNotificationPriority = 'High' | 'Medium';

/**
 * Defines the public SuperadminCommunicationNotification contract for communication notification center. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property category Value defined by the existing feature-local contract. Declared type: SuperadminCommunicationNotificationCategory.
 * @property icon Value defined by the existing feature-local contract. Declared type: string.
 * @property titleKey Display label for the owning feature. Declared type: string.
 * @property descriptionKey Value defined by the existing feature-local contract. Declared type: string.
 * @property timeKey Value defined by the existing feature-local contract. Declared type: string.
 * @property priority Value defined by the existing feature-local contract. Declared type: SuperadminCommunicationNotificationPriority.
 * @property link Value defined by the existing feature-local contract. Declared type: string.
 * @property read Value defined by the existing feature-local contract. Declared type: boolean.
 */
export interface SuperadminCommunicationNotification {
  id: string;
  category: SuperadminCommunicationNotificationCategory;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  timeKey: string;
  priority: SuperadminCommunicationNotificationPriority;
  link: string;
  read: boolean;
}

/**
 * Defines the public SuperadminCommunicationNotificationFilter contract for communication notification center. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminCommunicationNotificationFilter = 'All' | SuperadminCommunicationNotificationCategory | 'High Only';
