import type { AdminCommunicationNotificationCategory, AdminCommunicationNotificationDomain } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';

/** Canonical routes and source-observed API paths owned by the notification-center module. */
export const ADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES = {
  ROOT: '/admin/admin_communication/communication_notification_center',
  COMPLAINTS: '/admin/admin_communication/communication_complaints',
  NOTICES: '/admin/admin_communication/communication_notices',
  WHATSAPP_LOGS: '/admin/admin_communication/communication_whatsapp_logs',
  WHATSAPP_TEMPLATES: '/admin/admin_communication/communication_whatsapp_templates',
  REPORTS: '/admin/admin_dashboard/dashboard_reports',
  CRM_ENQUIRIES: '/admin/admin_members/members_enquiries?view=enquiries',
  FINANCE_RENEWALS: '/admin/admin_finance/finance_renewals',
  FINANCE_PAYMENT_PROMISES: '/admin/admin_finance/finance_payment_promises',
  FINANCE_LATE_FEES: '/admin/admin_finance/finance_late_fees',
  SEAT_MAINTENANCE: '/admin/admin_seats_shifts_lockers/seats_maintenance',
} as const;

/** Existing API adapter paths only; these do not establish a notification-service contract. */
export const ADMIN_COMMUNICATION_NOTIFICATION_CENTER_API = {
  COMPLAINTS: '/communication/complaints',
  NOTICES: '/communication/notices',
} as const;

export const ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES: ReadonlyArray<{ id: AdminCommunicationNotificationCategory; labelKey: string; icon: string }> = [
  { id: 'All', labelKey: 'FILTER_ALL_NOTIFICATIONS', icon: '🔔' },
  { id: 'Finance', labelKey: 'FILTER_FINANCE', icon: '💰' },
  { id: 'CRM', labelKey: 'FILTER_CRM', icon: '📞' },
  { id: 'Operations', labelKey: 'FILTER_OPERATIONS', icon: '🪑' },
  { id: 'Attendance', labelKey: 'FILTER_ATTENDANCE', icon: '📅' },
  { id: 'High Only', labelKey: 'FILTER_HIGH_PRIORITY_ONLY', icon: '🔴' },
];

export const ADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS: Record<AdminCommunicationNotificationDomain, string> = {
  Finance: 'bg-success-bg text-success-text',
  CRM: 'bg-info-bg text-info-text',
  Operations: 'bg-warning-bg text-warning-text',
  Attendance: 'bg-primary-subtle text-primary',
};
