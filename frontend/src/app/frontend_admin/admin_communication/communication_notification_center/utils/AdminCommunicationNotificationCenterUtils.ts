import { format, isBefore, isValid, parseISO, startOfDay } from 'date-fns';

import type { AdminCommunicationNotification, AdminCommunicationNotificationCategory } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';

/** Applies the notification-center category or high-priority filter without mutating its input. */
export function filterAdminCommunicationNotifications(
  notifications: readonly AdminCommunicationNotification[],
  category: AdminCommunicationNotificationCategory,
): AdminCommunicationNotification[] {
  if (category === 'All') return [...notifications];
  if (category === 'High Only') return notifications.filter((notification) => notification.priority === 'High');
  return notifications.filter((notification) => notification.category === category);
}

/** Returns a copy with every notification marked read; safe for immutable React state updates. */
export function markAdminCommunicationNotificationsRead(
  notifications: readonly AdminCommunicationNotification[],
): AdminCommunicationNotification[] {
  return notifications.map((notification) => notification.read ? notification : { ...notification, read: true });
}

export function countUnreadAdminCommunicationNotifications(
  notifications: readonly AdminCommunicationNotification[],
): number {
  return notifications.reduce((count, notification) => count + (notification.read ? 0 : 1), 0);
}

export type AdminCommunicationNoticeStatus = 'Active' | 'Expired' | 'Unknown';

/** Date-only notices remain active through their stated local calendar day. */
export function getAdminCommunicationNoticeStatus(validTill: string, now = new Date()): AdminCommunicationNoticeStatus {
  const datePart = validTill.slice(0, 10);
  const expiryDate = parseISO(datePart);
  if (datePart.length !== 10 || !isValid(expiryDate) || format(expiryDate, 'yyyy-MM-dd') !== datePart) return 'Unknown';
  return isBefore(expiryDate, startOfDay(now)) ? 'Expired' : 'Active';
}
