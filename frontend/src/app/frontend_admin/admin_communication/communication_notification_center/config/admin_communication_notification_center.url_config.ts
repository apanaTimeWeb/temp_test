import type { AdminCommunicationNotificationCategory } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';

/** Canonical routes and source-observed API paths owned by the notification-center module. */
export const ADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES = {
  ROOT: '/admin/admin_communication/communication_notification_center',
  COMPLAINTS: '/admin/admin_communication/communication_complaints',
  NOTICES: '/admin/admin_communication/communication_notices',
  WHATSAPP_LOGS: '/admin/admin_communication/communication_whatsapp_logs',
  WHATSAPP_TEMPLATES: '/admin/admin_communication/communication_whatsapp_templates',
  REPORTS: '/admin/admin_dashboard/dashboard_reports',
  CRM_ENQUIRIES: '/admin/admin_members/members_enquiries?view=enquiries',
  FINANCE_RENEWALS: '/admin/admin_finance/finance_payments',
  FINANCE_PAYMENT_PROMISES: '/admin/admin_finance/finance_payments',
  FINANCE_LATE_FEES: '/admin/admin_finance/finance_payments',
  SEAT_MAINTENANCE: '/admin/admin_seats_shifts_lockers/seats_management',
} as const;

export const ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES: ReadonlyArray<{ id: AdminCommunicationNotificationCategory; labelKey: string; icon: string }> = [
  { id: 'All', labelKey: 'FILTER_ALL_NOTIFICATIONS', icon: '🔔' },
  { id: 'Finance', labelKey: 'FILTER_FINANCE', icon: '💰' },
  { id: 'CRM', labelKey: 'FILTER_CRM', icon: '📞' },
  { id: 'Operations', labelKey: 'FILTER_OPERATIONS', icon: '🪑' },
  { id: 'Attendance', labelKey: 'FILTER_ATTENDANCE', icon: '📅' },
  { id: 'High Only', labelKey: 'FILTER_HIGH_PRIORITY_ONLY', icon: '🔴' },
];
