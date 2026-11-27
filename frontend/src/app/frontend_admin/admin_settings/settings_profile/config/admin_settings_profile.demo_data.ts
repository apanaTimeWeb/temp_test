/** Synthetic profile/session/history fixtures; rendered only when explicit frontend demo mode is enabled. */
export const ADMIN_PROFILE_DEMO_ACCOUNT = {
  initials: 'LA',
  nameKey: 'DEMO_ACCOUNT_NAME',
  email: 'admin@smartlibrary.example',
  phone: '+91 98765 43210',
  bio: 'DEMO_ACCOUNT_BIO',
} as const;

export const ADMIN_PROFILE_DEMO_SESSIONS = [
  { id: 'session-demo-1', deviceKey: 'SESSION_WINDOWS', browserKey: 'SESSION_CHROME', ip: '192.0.2.45', lastActiveKey: 'SESSION_CURRENT', current: true },
  { id: 'session-demo-2', deviceKey: 'SESSION_MACBOOK', browserKey: 'SESSION_SAFARI', ip: '192.0.2.102', lastActiveKey: 'SESSION_TWO_HOURS', current: false },
  { id: 'session-demo-3', deviceKey: 'SESSION_IPHONE', browserKey: 'SESSION_IOS_SAFARI', ip: '192.0.2.55', lastActiveKey: 'SESSION_YESTERDAY', current: false },
] as const;

export const ADMIN_PROFILE_DEMO_LOGIN_HISTORY = [
  { id: 'history-demo-1', dateKey: 'HISTORY_TODAY', ip: '192.0.2.45', deviceKey: 'HISTORY_WINDOWS_CHROME', status: 'success' },
  { id: 'history-demo-2', dateKey: 'HISTORY_YESTERDAY', ip: '192.0.2.102', deviceKey: 'HISTORY_MAC_SAFARI', status: 'success' },
  { id: 'history-demo-3', dateKey: 'HISTORY_SEPTEMBER_28', ip: '192.0.2.55', deviceKey: 'HISTORY_UNKNOWN_DEVICE', status: 'failed' },
  { id: 'history-demo-4', dateKey: 'HISTORY_SEPTEMBER_25', ip: '192.0.2.45', deviceKey: 'HISTORY_WINDOWS_CHROME', status: 'success' },
] as const;

export interface AdminSuperAdminSaasSubscription {
  planId: string;
  planName: string;
  planTier: string;
  provider: string;
  status: 'Active' | 'Grace Period' | 'Suspended';
  billingCycle: 'Annual' | 'Monthly' | 'Quarterly';
  priceFormatted: string;
  purchasedDate: string;
  expiryDate: string;
  daysRemaining: number;
  licenseKey: string;
  slaUptime: string;
  quotas: {
    branches: { used: number; total: number; label: string };
    seats: { used: number; total: number; label: string };
    messages: { used: number; total: number; label: string };
    staff: { used: number; total: number; label: string };
  };
  features: string[];
}

export const ADMIN_SUPERADMIN_SAAS_SUBSCRIPTION: AdminSuperAdminSaasSubscription = {
  planId: 'PLAN-SAAS-ENT-001',
  planName: 'Enterprise Multi-Branch Suite',
  planTier: 'Enterprise Tier',
  provider: 'SuperAdmin (LibraryOS Platform Cloud)',
  status: 'Active',
  billingCycle: 'Annual',
  priceFormatted: '₹29,999 / year',
  purchasedDate: '01 Jan 2026',
  expiryDate: '31 Dec 2026',
  daysRemaining: 42,
  licenseKey: 'LIC-LIBOS-2026-X89',
  slaUptime: '99.9% Uptime & 24x7 Priority Support',
  quotas: {
    branches: { used: 3, total: 5, label: '3 / 5 Branches Connected' },
    seats: { used: 380, total: 500, label: '380 / 500 Total Seats Allotted' },
    messages: { used: 8450, total: 10000, label: '8,450 / 10,000 WhatsApp & SMS Quota' },
    staff: { used: 12, total: 20, label: '12 / 20 Manager & Staff Accounts' },
  },
  features: [
    'Centralized Multi-Branch Governance',
    'Automated Turnstile RFID & Biometric Gate Sync',
    'Real-Time Live Seat & Locker Matrix',
    'Automated WhatsApp Expiry & Fee Overdue Alerts',
    'Daily Shift Closing & Security Deposit Auditing',
    'Priority Cloud Backup & SLA Guarantee',
  ],
};
