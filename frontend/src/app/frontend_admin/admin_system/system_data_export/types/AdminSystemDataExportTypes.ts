export type AdminSystemDataExportModuleId = 'students' | 'payments' | 'attendance' | 'expenses' | 'enquiries' | 'seats' | 'whatsapp' | 'audit';
export type AdminSystemDataExportPreset = 'custom' | 'due-fees' | 'expiring' | 'active';
export type AdminSystemQuickExportId = 'due-fees' | 'expiring' | 'active' | 'full-backup';
export type AdminSystemDataExportLocaleKey =
  | 'BREADCRUMB_SYSTEM' | 'BREADCRUMB_EXPORT' | 'TITLE' | 'SUBTITLE' | 'LIVE_UNAVAILABLE' | 'QUICK_EXPORTS_TITLE'
  | 'QUICK_DUE_FEES' | 'QUICK_DUE_FEES_DESCRIPTION' | 'QUICK_EXPIRING' | 'QUICK_EXPIRING_DESCRIPTION'
  | 'QUICK_ACTIVE' | 'QUICK_ACTIVE_DESCRIPTION' | 'QUICK_FULL_BACKUP' | 'QUICK_FULL_BACKUP_DESCRIPTION'
  | 'EXPORT_QUICK_ARIA' | 'EXPORT_CSV' | 'CUSTOM_BUILDER_TITLE' | 'CUSTOM_BUILDER_DESCRIPTION' | 'SELECT_ALL' | 'CLEAR_ALL'
  | 'MODULE_STUDENTS' | 'MODULE_STUDENTS_DESCRIPTION' | 'MODULE_PAYMENTS' | 'MODULE_PAYMENTS_DESCRIPTION'
  | 'MODULE_ATTENDANCE' | 'MODULE_ATTENDANCE_DESCRIPTION' | 'MODULE_EXPENSES' | 'MODULE_EXPENSES_DESCRIPTION'
  | 'MODULE_ENQUIRIES' | 'MODULE_ENQUIRIES_DESCRIPTION' | 'MODULE_SEATS' | 'MODULE_SEATS_DESCRIPTION'
  | 'MODULE_WHATSAPP' | 'MODULE_WHATSAPP_DESCRIPTION' | 'MODULE_AUDIT' | 'MODULE_AUDIT_DESCRIPTION'
  | 'DEMO_ROW_COUNT' | 'FROM_DATE' | 'TO_DATE' | 'MODULE_SINGULAR' | 'MODULE_PLURAL' | 'SELECTED' | 'FORMAT_LABEL'
  | 'DATE_RANGE_INVALID' | 'ESTIMATED_DEMO_ROWS';

export interface AdminSystemDataExportModuleDefinition {
  id: AdminSystemDataExportModuleId;
  labelKey: AdminSystemDataExportLocaleKey;
  descriptionKey: AdminSystemDataExportLocaleKey;
  icon: string;
  estimatedRows: number;
}

export interface AdminSystemDataExportDemoRow {
  module: AdminSystemDataExportModuleId;
  recordId: string;
  label: string;
  value: string;
  /** Synthetic date used only by the explicit frontend demo exporter. */
  recordDate: string;
  feeStatus?: AdminSystemDataExportDemoRowFeeStatus;
  subscriptionExpiry?: string;
}

export interface AdminSystemQuickExportDefinition {
  id: AdminSystemQuickExportId;
  labelKey: AdminSystemDataExportLocaleKey;
  descriptionKey: AdminSystemDataExportLocaleKey;
  icon: import('lucide-react').LucideIcon;
  moduleIds: readonly AdminSystemDataExportModuleId[];
  preset: AdminSystemDataExportPreset;
}

export type AdminSystemDataExportDemoRowFeeStatus = 'Paid' | 'Due';
