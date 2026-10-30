/** Canonical module routes/API endpoints and cohesive module-owned configuration constants. */
import { Palette, AlertCircle, Zap, CreditCard, Bell, Globe, type LucideIcon } from 'lucide-react';
import type { AdminSystemSettingsadmin_system_settingsurl_configLabelKey, AdminSystemSettingsadmin_system_settingsurl_configLabelKey2 } from '@/app/frontend_admin/admin_system/system_settings/types/AdminSystemSettingsComponentTypes';


/** Canonical source-observed routes and API endpoints for admin_system_settings. */
export const ADMIN_SYSTEM_SETTINGS_ROUTES = {
  route: '/admin/admin_system/system_settings',
  AUTH_LOGIN: '/auth/login',
  ACCESS_DENIED: '/403',
  DASHBOARD: '/dashboard',
  AUTO_SCALE: '/admin/admin_system/system_auto_scale',
  BACKUPS: '/admin/admin_system/system_backups',
  BRANDING: '/admin/admin_system/system_branding',
  BULK_IMPORT: '/admin/admin_system/system_bulk_import',
  DATA_EXPORT: '/admin/admin_system/system_data_export',
  GAP_FILLING: '/admin/admin_system/system_gap_filling',
  MAINTENANCE: '/admin/admin_system/system_maintenance',
  OFFLINE: '/admin/admin_system/system_offline',
  POWER_SAVING: '/admin/admin_system/system_power_saving',
  PROFILE: '/admin/admin_system/system_profile',
  SMART_ID: '/admin/admin_system/system_smart_id',
  WAITLIST_AUTOMATION: '/admin/admin_system/system_waitlist_automation',
  WHATSAPP_INTEGRATION: '/admin/admin_system/system_whatsapp_integration',
  SEAT_MANAGEMENT: '/admin/admin_seats_shifts_lockers/seats_management',
  LOCKER_MATRIX: '/admin/admin_seats_shifts_lockers/lockers_matrix',
} as const;

/** No live settings DTO is defined by the supplied frontend contract; endpoint is source-observed only. */
export const ADMIN_SYSTEM_SETTINGS_API = {
  LIST: '/api/v1/admin/system',
} as const;

export type AdminSystemSettingsCategoryId = 'branding' | 'late-fee' | 'auto-suspend' | 'upi' | 'notifications' | 'general';

/** UI navigation labels/icons for the Admin System settings tabs. */
export const ADMIN_SYSTEM_SETTINGS_CATEGORIES: ReadonlyArray<{ id: AdminSystemSettingsCategoryId; labelKey: AdminSystemSettingsadmin_system_settingsurl_configLabelKey; icon: LucideIcon }> = [
  { id: 'branding', labelKey: 'BRANDING', icon: Palette },
  { id: 'late-fee', labelKey: 'LATE_FEE_RULES', icon: AlertCircle },
  { id: 'auto-suspend', labelKey: 'AUTO_SUSPEND_RULES', icon: Zap },
  { id: 'upi', labelKey: 'UPI_PAYMENT', icon: CreditCard },
  { id: 'notifications', labelKey: 'NOTIFICATIONS', icon: Bell },
  { id: 'general', labelKey: 'GENERAL', icon: Globe },
];

export const ADMIN_SYSTEM_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const ADMIN_SYSTEM_DEFAULT_PAGE_SIZE = 25 as const;

/** Exact payment fields from the module's validated AdminSystemSettingsSchema. */
type AdminSystemSettingsPaymentModeField = 'acceptCash' | 'acceptUpi' | 'acceptCard' | 'acceptBank';

export const ADMIN_SYSTEM_SETTINGS_PAYMENT_MODE_OPTIONS: ReadonlyArray<{
  key: AdminSystemSettingsPaymentModeField;
  labelKey: AdminSystemSettingsadmin_system_settingsurl_configLabelKey2;
}> = [
  { key: 'acceptCash', labelKey: 'PAYMENT_MODE_CASH' },
  { key: 'acceptUpi', labelKey: 'PAYMENT_MODE_UPI' },
  { key: 'acceptCard', labelKey: 'PAYMENT_MODE_CARD' },
  { key: 'acceptBank', labelKey: 'PAYMENT_MODE_BANK_TRANSFER' },
];
