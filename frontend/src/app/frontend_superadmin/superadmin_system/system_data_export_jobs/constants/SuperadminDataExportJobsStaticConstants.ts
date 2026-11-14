import { createElement } from 'react';
import { CalendarDays, CreditCard, Database, Users } from 'lucide-react';
import type { QuickExport } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsPageClientComponentTypes';

// RESPONSIBILITY: Define stable module-owned constants for system data export jobs; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminDataExportJobsPageClient.tsx. */
export const SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES = [
  { id: 'students',     labelKey: 'COPY.STUDENTS',            descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_STUDENT_RECORDS_ARE_NOT_INCLUDED', icon: '🎓', estimatedRows: 248,  formats: ['Manifest CSV'] },
  { id: 'payments',     labelKey: 'COPY.PAYMENTS_AND_FEES',     descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_PAYMENT_RECORDS_ARE_NOT_INCLUDED',     icon: '💳', estimatedRows: 1240, formats: ['Manifest CSV'] },
  { id: 'attendance',   labelKey: 'COPY.ATTENDANCE',          descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_ATTENDANCE_ROWS_ARE_NOT_INCLUDED',          icon: '📅', estimatedRows: 5800, formats: ['Manifest CSV'] },
  { id: 'expenses',     labelKey: 'COPY.EXPENSES',            descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_EXPENSE_RECORDS_ARE_NOT_INCLUDED',         icon: '💸', estimatedRows: 320,  formats: ['Manifest CSV'] },
  { id: 'enquiries',    labelKey: 'COPY.CRM_ENQUIRIES',       descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_CRM_RECORDS_ARE_NOT_INCLUDED',      icon: '📞', estimatedRows: 186,  formats: ['Manifest CSV'] },
  { id: 'seats',        labelKey: 'COPY.SEATS_AND_LOCKERS',     descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_SEAT_LOCKER_RECORDS_ARE_NOT_INCLUDED',               icon: '🪑', estimatedRows: 140,  formats: ['Manifest CSV'] },
  { id: 'whatsapp',     labelKey: 'COPY.WHATSAPP_LOGS',       descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_MESSAGE_LOGS_ARE_NOT_INCLUDED',        icon: '📱', estimatedRows: 890,  formats: ['Manifest CSV'] },
  { id: 'audit',        labelKey: 'COPY.AUDIT_LOGS',          descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_LIVE_AUDIT_LOGS_ARE_NOT_INCLUDED',        icon: '🔍', estimatedRows: 2400, formats: ['Manifest CSV'] },
];


/** Static module-owned options/status mapping extracted from SuperadminDataExportJobsBadge.tsx. */
export const SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS = {
  default: 'sys-badge--outline', primary: 'sys-badge--primary', success: 'sys-badge--success',
  warning: 'sys-badge--warning', danger: 'sys-badge--danger', info: 'sys-badge--info', outline: 'sys-badge--outline',
};


/** Static module-owned options/status mapping extracted from SuperadminDataExportJobsButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminDataExportJobsButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};

export const SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS: QuickExport[] = [
  { id: 'due-fees', labelKey: 'COPY.FEE_DUE_REPORT', descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_NO_FEE_RECORDS_ARE_INCLUDED', icon: createElement(CreditCard, { size: 18 }), formatKey: 'COPY.MANIFEST_CSV' },
  { id: 'expiring', labelKey: 'COPY.EXPIRING_SUBSCRIPTIONS', descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_NO_SUBSCRIPTION_RECORDS_ARE_INCLUDED', icon: createElement(CalendarDays, { size: 18 }), formatKey: 'COPY.MANIFEST_CSV' },
  { id: 'active', labelKey: 'COPY.ACTIVE_STUDENTS', descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_NO_STUDENT_RECORDS_ARE_INCLUDED', icon: createElement(Users, { size: 18 }), formatKey: 'COPY.MANIFEST_CSV' },
  { id: 'full-backup', labelKey: 'COPY.FULL_DATA_BACKUP', descriptionKey: 'COPY.MANIFEST_DEFINITION_ONLY_NO_BACKUP_ARCHIVE_IS_CREATED', icon: createElement(Database, { size: 18 }), formatKey: 'COPY.MANIFEST_CSV' },
];
