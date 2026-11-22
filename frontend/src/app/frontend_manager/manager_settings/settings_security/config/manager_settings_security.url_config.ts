export const MANAGER_SETTINGS_SECURITY_ROUTES = {
  root: '/frontend_manager/manager_settings/settings_security',
  password: '/frontend_manager/manager_settings/settings_security?tab=password',
  twoFactor: '/frontend_manager/manager_settings/settings_security?tab=2fa',
  sessions: '/frontend_manager/manager_settings/settings_security?tab=sessions',
  history: '/frontend_manager/manager_settings/settings_security?tab=history',
} as const;

export type ManagerSettingsSecurityRouteKey = keyof typeof MANAGER_SETTINGS_SECURITY_ROUTES;
