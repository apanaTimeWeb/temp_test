import type { AdminSecurityEvent } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';

/** Synthetic samples only. Values use reserved domains and documentation IPs, never real account data. */
export const ADMIN_SECURITY_DASHBOARD_METRICS = [
  { id: 'sessions', labelKey: 'METRIC_ACTIVE_SESSIONS', value: 12, tone: 'success' },
  { id: 'failed-logins', labelKey: 'METRIC_FAILED_LOGINS', value: 3, tone: 'danger' },
  { id: 'blocked-accounts', labelKey: 'METRIC_BLOCKED_ACCOUNTS', value: 1, tone: 'warning' },
] as const;

export const ADMIN_SECURITY_ACTIVE_SESSION_FIXTURES = [
  { id: 'session-demo-1', nameKey: 'DEMO_MANAGER_ONE', roleKey: 'ROLE_BRANCH_MANAGER', deviceKey: 'DEVICE_WINDOWS_CHROME', ip: '192.0.2.10', current: true },
  { id: 'session-demo-2', nameKey: 'DEMO_MANAGER_TWO', roleKey: 'ROLE_SHIFT_MANAGER', deviceKey: 'DEVICE_MAC_SAFARI', ip: '192.0.2.20', current: false },
] as const;

export const ADMIN_SECURITY_FAILED_LOGIN_FIXTURES = [
  { id: 'failed-demo-1', timeKey: 'TIME_TEN_MINUTES', account: 'manager.one@example.invalid', ip: '192.0.2.31', reasonKey: 'REASON_INVALID_PASSWORD' },
  { id: 'failed-demo-2', timeKey: 'TIME_ONE_HOUR', account: 'unknown-demo-account', ip: '192.0.2.32', reasonKey: 'REASON_USER_NOT_FOUND' },
  { id: 'failed-demo-3', timeKey: 'TIME_YESTERDAY', account: 'manager.two@example.invalid', ip: '192.0.2.33', reasonKey: 'REASON_TWO_FACTOR_FAILED' },
] as const;

export const ADMIN_SECURITY_BLOCKED_ACCOUNT_FIXTURES = [
  { id: 'account-demo-1', nameKey: 'DEMO_MANAGER_THREE', email: 'manager.three@example.invalid', status: 'locked', reasonKey: 'REASON_MULTIPLE_FAILED_LOGINS' },
  { id: 'account-demo-2', nameKey: 'DEMO_MANAGER_TWO', email: 'manager.two@example.invalid', status: 'active', reasonKey: 'REASON_NONE' },
] as const;

export const ADMIN_SECURITY_DEVICE_SESSION_FIXTURES = [
  { id: 'device-demo-1', managerKey: 'DEMO_MANAGER_ONE', deviceKey: 'DEVICE_WINDOWS_11_CHROME', locationKey: 'LOCATION_PUNE', ip: '192.0.2.10', dateKey: 'DATE_SEPTEMBER_10' },
  { id: 'device-demo-2', managerKey: 'DEMO_MANAGER_ONE', deviceKey: 'DEVICE_ANDROID_CHROME', locationKey: 'LOCATION_PUNE', ip: '192.0.2.11', dateKey: 'DATE_SEPTEMBER_12' },
  { id: 'device-demo-3', managerKey: 'DEMO_MANAGER_TWO', deviceKey: 'DEVICE_MAC_SAFARI', locationKey: 'LOCATION_MUMBAI', ip: '192.0.2.20', dateKey: 'DATE_SEPTEMBER_28' },
  { id: 'device-demo-4', managerKey: 'DEMO_MANAGER_FOUR', deviceKey: 'DEVICE_IPAD_SAFARI', locationKey: 'LOCATION_UNKNOWN', ip: '192.0.2.40', dateKey: 'DATE_SEPTEMBER_29' },
] as const;

export const ADMIN_SECURITY_EVENT_FIXTURES: readonly AdminSecurityEvent[] = [
  { id: 'event-demo-1', timeKey: 'TIME_TODAY_1045', actionKey: 'EVENT_PASSWORD_CHANGED', userKey: 'DEMO_MANAGER_ONE', category: 'password', tone: 'info' },
  { id: 'event-demo-2', timeKey: 'TIME_YESTERDAY_1630', actionKey: 'EVENT_ACCOUNT_LOCKED', userKey: 'DEMO_MANAGER_THREE', category: 'account', tone: 'danger' },
  { id: 'event-demo-3', timeKey: 'TIME_SEPTEMBER_28_0915', actionKey: 'EVENT_TWO_FACTOR_ENABLED', userKey: 'DEMO_MANAGER_TWO', category: '2fa', tone: 'success' },
  { id: 'event-demo-4', timeKey: 'TIME_SEPTEMBER_25_1400', actionKey: 'EVENT_FORCED_LOGOUT', userKey: 'DEMO_SYSTEM_ADMIN', category: 'session', tone: 'warning' },
] as const;

export const ADMIN_SECURITY_ANTI_FRAUD_FIXTURES = [
  {
    id: 'fraud-log-001',
    timestamp: '2026-11-01 16:30',
    severity: 'HIGH_RISK' as const,
    entityType: 'FEE_DISCOUNT' as const,
    actionTitle: 'Student Fee Manual Reduction',
    targetEntity: 'Student #104 (Aman Gupta)',
    oldValue: '₹1,500.00 (Standard Plan)',
    newValue: '₹1,000.00 (Discounted)',
    managerName: 'Rohit Mehra',
    managerRole: 'Shift Manager',
    branchName: 'Karol Bagh Central',
    justificationNotes: 'Coupon override applied: SPECIAL500. Counter cash collected was ₹1,000.',
    ipAddress: '192.0.2.14',
  },
  {
    id: 'fraud-log-002',
    timestamp: '2026-11-01 17:15',
    severity: 'HIGH_RISK' as const,
    entityType: 'SEAT_STATUS' as const,
    actionTitle: 'Seat Locked into Maintenance',
    targetEntity: 'Seat #14 (Hall A - Reserved)',
    oldValue: 'Available / Active',
    newValue: 'Under Maintenance (10 Days)',
    managerName: 'Rahul Sharma',
    managerRole: 'Branch Manager',
    branchName: 'Karol Bagh Central',
    justificationNotes: 'Table leg loose. Flagged for review: seat was occupied by non-registered student on CCTV.',
    ipAddress: '192.0.2.10',
  },
  {
    id: 'fraud-log-003',
    timestamp: '2026-10-31 21:20',
    severity: 'HIGH_RISK' as const,
    entityType: 'PAYMENT' as const,
    actionTitle: 'Cash Payment Receipt Deletion',
    targetEntity: 'Receipt #RCT-9912 (₹2,000.00)',
    oldValue: 'Status: Paid (Cash)',
    newValue: 'Status: Voided / Deleted',
    managerName: 'Vikas Kumar',
    managerRole: 'Branch Manager',
    branchName: 'Mukherjee Nagar',
    justificationNotes: 'Manager claimed accidental duplicate payment entry. Cash drawer showed shortage.',
    ipAddress: '192.0.2.22',
  },
  {
    id: 'fraud-log-004',
    timestamp: '2026-10-31 14:45',
    severity: 'MEDIUM_WARNING' as const,
    entityType: 'SECURITY_DEPOSIT' as const,
    actionTitle: 'Deposit Refund Released Without Return Slip',
    targetEntity: 'Student #88 (Sneha Kapoor)',
    oldValue: 'Deposit Held: ₹1,000.00',
    newValue: 'Deposit Refunded: ₹1,000.00',
    managerName: 'Priya Verma',
    managerRole: 'Branch Manager',
    branchName: 'Laxmi Nagar Hub',
    justificationNotes: 'Student lost locker physical token. Overridden with verbal manager confirmation.',
    ipAddress: '192.0.2.35',
  },
  {
    id: 'fraud-log-005',
    timestamp: '2026-10-30 11:15',
    severity: 'LOW_INFO' as const,
    entityType: 'SEAT_STATUS' as const,
    actionTitle: 'Shift Capacity Temporary Expansion',
    targetEntity: 'Afternoon Shift (Hall B)',
    oldValue: 'Capacity: 30 Seats',
    newValue: 'Capacity: 35 Seats',
    managerName: 'Sunita Rao',
    managerRole: 'Branch Manager',
    branchName: 'Noida Sector 62',
    justificationNotes: 'Extra temporary study stools placed during UPSC prelims sprint.',
    ipAddress: '192.0.2.40',
  },
] as const;
