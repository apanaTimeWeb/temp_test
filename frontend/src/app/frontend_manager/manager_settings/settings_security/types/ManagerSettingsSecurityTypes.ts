export type ManagerSecurityTab = 'password' | '2fa' | 'sessions' | 'history';

export interface ManagerProfileInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  branchName: string;
  branchCode: string;
  accountCreated: string;
  lastPasswordChanged: string;
}

export interface ManagerActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export interface ManagerLoginHistoryEntry {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

export interface ManagerTwoFactorConfig {
  enabled: boolean;
  secretKey: string;
  qrPayload: string;
  backupCodesRemaining: number;
  lastVerified?: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
