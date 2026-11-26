// RESPONSIBILITY: Aggregate all mandated notification templates across account and system categories.
// FLOW: Account/System templates -> SuperadminCommunicationNotificationCenterTemplatesConstants.ts -> consumers.

import { ACCOUNT_NOTIFICATION_TEMPLATES } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterAccountTemplates';
import { SYSTEM_NOTIFICATION_TEMPLATES } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterSystemTemplates';
import type { NotificationTemplate } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export const MANDATED_NOTIFICATION_TEMPLATES: ReadonlyArray<NotificationTemplate> = [
  ...ACCOUNT_NOTIFICATION_TEMPLATES,
  ...SYSTEM_NOTIFICATION_TEMPLATES,
];
