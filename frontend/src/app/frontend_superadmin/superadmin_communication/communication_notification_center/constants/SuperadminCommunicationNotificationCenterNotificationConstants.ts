import type {
  NotificationCategory,
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationPriority,
  NotificationTargetAccount,
  NotificationTemplate,
  SuperadminCommunicationNotificationCategoryOption,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export const NOTIFICATION_CHANNELS: ReadonlyArray<{
  id: NotificationChannel;
  label: string;
  icon: string;
  badgeClass: string;
}> = [
  { id: 'EMAIL', label: 'Email', icon: 'Mail', badgeClass: 'bg-sky-500/15 text-sky-400 border border-sky-500/30' },
  { id: 'SMS', label: 'SMS', icon: 'MessageSquare', badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: 'PhoneCall', badgeClass: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
] as const;

export const NOTIFICATION_STATUS_CONFIG: Record<
  NotificationDeliveryStatus,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: 'CheckCheck',
  },
  SENT: {
    label: 'Sent',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    icon: 'Send',
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: 'Clock',
  },
  FAILED: {
    label: 'Failed',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    icon: 'AlertCircle',
  },
  BOUNCED: {
    label: 'Bounced',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: 'AlertTriangle',
  },
};

export const NOTIFICATION_PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; badgeClass: string; icon: string }
> = {
  LOW: { label: 'Low', badgeClass: 'bg-slate-500/15 text-slate-400 border border-slate-500/30', icon: '🟢' },
  NORMAL: { label: 'Normal', badgeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30', icon: '🔵' },
  HIGH: { label: 'High', badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', icon: '🟡' },
  URGENT: { label: 'Urgent', badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30', icon: '🔴' },
};

/** Pre-configured target library accounts for account-specific dispatch */
export const TARGET_LIBRARY_ACCOUNTS: NotificationTargetAccount[] = [
  { id: 'lib-001', name: 'Central Apex Library', code: 'CAL-HQ', email: 'admin@apexlibrary.in', phone: '+919876543210', planName: 'Enterprise SaaS', branchCount: 8, status: 'ACTIVE' },
  { id: 'lib-002', name: 'City Central Reading Lounge', code: 'CCRL-01', email: 'director@citylounge.com', phone: '+919811223344', planName: 'Growth Plan', branchCount: 3, status: 'ACTIVE' },
  { id: 'lib-003', name: 'Knowledge Hub Study Rooms', code: 'KHUB-09', email: 'owner@knowledgehub.org', phone: '+919822334455', planName: 'Starter Pro', branchCount: 1, status: 'ACTIVE' },
  { id: 'lib-004', name: 'Prism Quiet Study Library', code: 'PRISM-02', email: 'billing@prismlib.in', phone: '+919833445566', planName: 'Standard Plan', branchCount: 2, status: 'TRIAL' },
  { id: 'lib-005', name: 'Metro Digital Library & Coworking', code: 'METRO-05', email: 'contact@metrolib.com', phone: '+919844556677', planName: 'Enterprise SaaS', branchCount: 5, status: 'SUSPENDED' },
];

/** The 10 Mandated System Notification Templates with full Email, SMS, WhatsApp copies */
// Mandated templates extracted to sub-constants file for file size compliance (< 300 lines)
export { MANDATED_NOTIFICATION_TEMPLATES } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterTemplatesConstants';

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
