import type {
  ManagerActiveSession,
  ManagerLoginHistoryEntry,
  ManagerProfileInfo,
  ManagerTwoFactorConfig,
} from '../types/ManagerSettingsSecurityTypes';

export const INITIAL_MANAGER_PROFILE: ManagerProfileInfo = {
  name: 'Rajesh Kumar',
  role: 'Library Branch Manager',
  email: 'rajesh.kumar@smartlibrary.in',
  phone: '+91 98765 43210',
  branchName: 'Central Library · Main Branch',
  branchCode: 'LIB-MAIN-01',
  accountCreated: '15 Jan 2025',
  lastPasswordChanged: '45 days ago',
};

export const INITIAL_ACTIVE_SESSIONS: ManagerActiveSession[] = [
  {
    id: 'session-win-current',
    device: 'Dell OptiPlex 7090 (Manager Desk)',
    browser: 'Chrome 130.0',
    os: 'Windows 11 Pro',
    ip: '103.21.58.12',
    location: 'Patna, Bihar, India',
    lastActive: 'Active now',
    isCurrent: true,
    deviceType: 'desktop',
  },
  {
    id: 'session-android-mobile',
    device: 'Samsung Galaxy S23 (Manager App)',
    browser: 'Library OS Mobile v2.4',
    os: 'Android 14',
    ip: '152.57.19.44',
    location: 'Patna, Bihar, India',
    lastActive: '32 minutes ago',
    isCurrent: false,
    deviceType: 'mobile',
  },
  {
    id: 'session-mac-laptop',
    device: 'Apple MacBook Air M2 (Home Office)',
    browser: 'Safari 18.1',
    os: 'macOS Sonoma',
    ip: '103.21.58.14',
    location: 'Patna, Bihar, India',
    lastActive: 'Yesterday at 9:15 PM',
    isCurrent: false,
    deviceType: 'desktop',
  },
];

export const INITIAL_LOGIN_HISTORY: ManagerLoginHistoryEntry[] = [
  {
    id: 'log-01',
    timestamp: '17 Nov 2026, 09:30 AM',
    ip: '103.21.58.12',
    device: 'Dell OptiPlex 7090',
    browser: 'Chrome 130',
    location: 'Patna, Bihar',
    status: 'success',
  },
  {
    id: 'log-02',
    timestamp: '16 Nov 2026, 08:45 PM',
    ip: '152.57.19.44',
    device: 'Samsung Galaxy S23',
    browser: 'Mobile App',
    location: 'Patna, Bihar',
    status: 'success',
  },
  {
    id: 'log-03',
    timestamp: '15 Nov 2026, 11:20 PM',
    ip: '185.220.101.5',
    device: 'Unknown Linux Box',
    browser: 'Firefox 115',
    location: 'Frankfurt, Germany',
    status: 'failed',
    failureReason: 'Invalid Password Attempt (Blocked)',
  },
  {
    id: 'log-04',
    timestamp: '15 Nov 2026, 10:10 AM',
    ip: '103.21.58.14',
    device: 'MacBook Air M2',
    browser: 'Safari 18',
    location: 'Patna, Bihar',
    status: 'success',
  },
  {
    id: 'log-05',
    timestamp: '14 Nov 2026, 09:15 AM',
    ip: '103.21.58.12',
    device: 'Dell OptiPlex 7090',
    browser: 'Chrome 130',
    location: 'Patna, Bihar',
    status: 'success',
  },
];

export const INITIAL_TWO_FACTOR_CONFIG: ManagerTwoFactorConfig = {
  enabled: false,
  secretKey: 'JBSWY3DPEHPK3PXP',
  qrPayload: 'otpauth://totp/SmartLibrary:rajesh.kumar@smartlibrary.in?secret=JBSWY3DPEHPK3PXP&issuer=SmartLibrary',
  backupCodesRemaining: 8,
  lastVerified: undefined,
};

export const INITIAL_BACKUP_CODES = [
  '8492-3841',
  '9214-5820',
  '3184-7290',
  '5582-1940',
  '4920-8193',
  '7391-4820',
  '6201-9482',
  '1948-5729',
];
