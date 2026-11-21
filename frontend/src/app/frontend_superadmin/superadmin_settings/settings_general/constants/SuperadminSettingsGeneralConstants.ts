// FLOW: Feature consumers -> superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Settings Constants; centralizes stable module-owned options and configuration for all 11 Global Settings areas. */
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FileCheck,
  HardDrive,
  Database,
  CreditCard,
  Sliders,
} from 'lucide-react';

export const SUPERADMIN_SETTINGS_TABS = [
  { name: 'General', labelKey: 'COPY.TAB_GENERAL', icon: Globe },
  { name: 'Permissions', labelKey: 'COPY.TAB_PERMISSIONS', icon: ShieldCheck },
  { name: 'Maintenance Mode', labelKey: 'COPY.TAB_MAINTENANCE_MODE', icon: ShieldAlert },
] as const;

export const SETTINGS_SECTION_PILLS = [
  { id: 'all', label: 'All Settings', icon: Sliders },
  { id: 'platform_regional', label: 'Platform & Regional', icon: Globe },
  { id: 'branch_defaults', label: 'Branch Settings', icon: Building2 },
  { id: 'security_policies', label: 'Password & MFA', icon: ShieldCheck },
  { id: 'upload_restrictions', label: 'Upload Restrictions', icon: HardDrive },
  { id: 'maintenance_mode', label: 'Maintenance Mode', icon: ShieldAlert },
  { id: 'data_retention', label: 'Data Retention', icon: Database },
  { id: 'subscription_grace', label: 'Subscription & Grace', icon: CreditCard },
] as const;

export type SettingsSectionId = typeof SETTINGS_SECTION_PILLS[number]['id'];

export const AVAILABLE_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +05:30)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT -05:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST +00:00)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +04:00)' },
] as const;

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English (US/UK)', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇦🇪' },
  { code: 'nl', name: 'Dutch (Nederlands)', flag: '🇳🇱' },
] as const;

export const AVAILABLE_CURRENCIES = [
  { code: 'INR (₹)', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD ($)', symbol: '$', name: 'US Dollar' },
  { code: 'AED (د.إ)', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'EUR (€)', symbol: '€', name: 'Euro' },
  { code: 'GBP (£)', symbol: '£', name: 'British Pound' },
] as const;

export const MFA_ENFORCEMENT_OPTIONS = [
  { value: 'DISABLED', label: 'Disabled (Password Only)' },
  { value: 'OPTIONAL', label: 'Optional (User Configurable)' },
  { value: 'SUPERADMIN_ONLY', label: 'SuperAdmin Only (Recommended)' },
  { value: 'ALL_ADMINS', label: 'All Administrators (Strict)' },
] as const;

export const BACKUP_SCHEDULE_OPTIONS = [
  { value: 'HOURLY', label: 'Hourly Snapshots (Mission Critical)' },
  { value: 'DAILY', label: 'Daily at 02:00 AM UTC (Recommended)' },
  { value: 'WEEKLY', label: 'Weekly Consolidated Archive' },
] as const;

export const POPULAR_FILE_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.xlsx',
  '.csv',
] as const;
