import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import type { AdminSystemBulkImportScenario } from '@/app/frontend_admin/admin_system/system_bulk_import/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminSystemBulkImportRowStatus = 'ok' | 'error' | 'warning';

export interface AdminSystemBulkImportPreviewRow {
  row: number;
  name: string;
  phone: string;
  email: string;
  shift: string;
  seat: string;
  plan?: string;
  feePaid?: string;
  joinDate?: string;
  status: AdminSystemBulkImportRowStatus;
  issue?: string;
}

export type AdminSystemBulkImportIssueCode =
  | 'IMPORT_ROW_NAME_REQUIRED'
  | 'IMPORT_ROW_PHONE_REQUIRED'
  | 'IMPORT_ROW_SHIFT_REQUIRED'
  | 'IMPORT_ROW_EMAIL_OPTIONAL';

export type AdminSystemBulkImportCsvErrorCode =
  | 'IMPORT_CSV_EMPTY'
  | 'IMPORT_CSV_HEADER_INVALID'
  | 'IMPORT_CSV_UNTERMINATED_QUOTE' | 'IMPORT_CSV_MALFORMED_QUOTES'
  | 'IMPORT_CSV_EXTRA_CELLS'
  | 'IMPORT_CSV_UNSUPPORTED';

export interface AdminSystemBulkImportCsvParseResult {
  rows: AdminSystemBulkImportPreviewRow[];
  errorCode?: AdminSystemBulkImportCsvErrorCode;
}

export type AdminSystemBulkImportStep = 'upload' | 'preview' | 'importing' | 'done';

export interface AdminSystemBulkImportCompletionSectionProps {
  model: ReturnType<typeof useBulkImportPage>;
}

export interface AdminSystemBulkImportPageViewProps {
  model: ReturnType<typeof useBulkImportPage>;
}

export interface AdminSystemBulkImportPageViewSummarySectionProps {
  model: ReturnType<typeof useBulkImportPage>;
}

export interface AdminSystemBulkImportProgressSectionProps {
  model: ReturnType<typeof useBulkImportPage>;
}

export interface AdminSystemBulkImportUploadSectionProps {
  model: ReturnType<typeof useBulkImportPage>;
}

export interface AdminSystemBulkImportHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemBulkImportScenario;
}

export type AdminSystemBulkImportadmin_system_bulk_import_constantsVariant = 'success' | 'warning' | 'danger';
export type AdminSystemBulkImportStepperItemLabelKey = 'IMPORT_STEP_UPLOAD' | 'IMPORT_STEP_REVIEW' | 'IMPORT_STEP_IMPORTING' | 'IMPORT_STEP_COMPLETE';
