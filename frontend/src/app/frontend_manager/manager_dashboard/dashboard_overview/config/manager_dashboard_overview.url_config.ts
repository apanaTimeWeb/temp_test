/** Canonical route contract for the manager dashboard overview. */
const ROOT = '/frontend_manager/manager_dashboard/dashboard_overview' as const;

export const MANAGER_DASHBOARD_OVERVIEW_ROUTES = {
  root: ROOT,
  DASHBOARD: ROOT,
  REPORTS: '/frontend_manager/manager_dashboard/dashboard_reports',
  STUDENTS: '/frontend_manager/manager_members/members_directory',
  CRM_ENQUIRIES: '/frontend_manager/manager_members/members_enquiries',
  FINANCE_COLLECT_FEE: '/frontend_manager/manager_finance/finance_collect_fee',
  FINANCE_RENEWALS: '/frontend_manager/manager_finance/finance_renewals',
  COMMUNICATION_COMPLAINTS: '/frontend_manager/manager_communication/communication_complaints',
  ENGAGEMENT_ATTENDANCE: '/frontend_manager/manager_attendance/attendance_daily',
  ENGAGEMENT_QR_SCANNER: '/frontend_manager/manager_attendance/attendance_qr_scanner',
} as const;

/** Dashboard overview has no verified external API endpoint contract. */
export const MANAGER_DASHBOARD_OVERVIEW_API = {} as const;
