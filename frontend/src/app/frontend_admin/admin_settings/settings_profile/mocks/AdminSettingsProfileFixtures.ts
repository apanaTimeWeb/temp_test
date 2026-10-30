
/** Synthetic profile/session/history fixtures; only render when explicit frontend demo mode is enabled. */
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

/** No handler is registered because no verified profile API endpoint exists in the supplied contract. */
export const ADMIN_PROFILE_MSW_HANDLERS = [] as const;
