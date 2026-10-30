import { CalendarDays, CreditCard, Database, Users } from 'lucide-react';
import type { AdminSystemDataExportModuleDefinition, AdminSystemQuickExportDefinition } from '@/app/frontend_admin/admin_system/system_data_export/types/AdminSystemDataExportTypes';

export const ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_FROM = '2026-01-01' as const;
export const ADMIN_SYSTEM_DATA_EXPORT_DEFAULT_DATE_TO = '2026-04-12' as const;

export const ADMIN_SYSTEM_DATA_EXPORT_MODULES: readonly AdminSystemDataExportModuleDefinition[] = [
  { id: 'students', labelKey: 'MODULE_STUDENTS', descriptionKey: 'MODULE_STUDENTS_DESCRIPTION', icon: '🎓', estimatedRows: 3 },
  { id: 'payments', labelKey: 'MODULE_PAYMENTS', descriptionKey: 'MODULE_PAYMENTS_DESCRIPTION', icon: '💳', estimatedRows: 3 },
  { id: 'attendance', labelKey: 'MODULE_ATTENDANCE', descriptionKey: 'MODULE_ATTENDANCE_DESCRIPTION', icon: '📅', estimatedRows: 3 },
  { id: 'expenses', labelKey: 'MODULE_EXPENSES', descriptionKey: 'MODULE_EXPENSES_DESCRIPTION', icon: '💸', estimatedRows: 2 },
  { id: 'enquiries', labelKey: 'MODULE_ENQUIRIES', descriptionKey: 'MODULE_ENQUIRIES_DESCRIPTION', icon: '📞', estimatedRows: 2 },
  { id: 'seats', labelKey: 'MODULE_SEATS', descriptionKey: 'MODULE_SEATS_DESCRIPTION', icon: '🪑', estimatedRows: 3 },
  { id: 'whatsapp', labelKey: 'MODULE_WHATSAPP', descriptionKey: 'MODULE_WHATSAPP_DESCRIPTION', icon: '📱', estimatedRows: 2 },
  { id: 'audit', labelKey: 'MODULE_AUDIT', descriptionKey: 'MODULE_AUDIT_DESCRIPTION', icon: '🔍', estimatedRows: 3 },
] as const;

const allExportModules = ADMIN_SYSTEM_DATA_EXPORT_MODULES.map((module) => module.id);

export const ADMIN_SYSTEM_QUICK_EXPORTS: readonly AdminSystemQuickExportDefinition[] = [
  { id: 'due-fees', labelKey: 'QUICK_DUE_FEES', descriptionKey: 'QUICK_DUE_FEES_DESCRIPTION', icon: CreditCard, moduleIds: ['payments'], preset: 'due-fees' },
  { id: 'expiring', labelKey: 'QUICK_EXPIRING', descriptionKey: 'QUICK_EXPIRING_DESCRIPTION', icon: CalendarDays, moduleIds: ['students'], preset: 'expiring' },
  { id: 'active', labelKey: 'QUICK_ACTIVE', descriptionKey: 'QUICK_ACTIVE_DESCRIPTION', icon: Users, moduleIds: ['students'], preset: 'active' },
  { id: 'full-backup', labelKey: 'QUICK_FULL_BACKUP', descriptionKey: 'QUICK_FULL_BACKUP_DESCRIPTION', icon: Database, moduleIds: allExportModules, preset: 'custom' },
] as const;
