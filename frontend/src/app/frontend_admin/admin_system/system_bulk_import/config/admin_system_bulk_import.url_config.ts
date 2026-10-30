import { AlertTriangle, CheckCircle, XCircle, type LucideIcon } from 'lucide-react';
import type { AdminSystemBulkImportRowStatus, AdminSystemBulkImportStep } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';
import type { AdminSystemBulkImportStepperItemLabelKey, AdminSystemBulkImportadmin_system_bulk_import_constantsVariant } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';

/**
 * Canonical UI/API contract for admin_system_bulk_import.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SYSTEM_BULK_IMPORT_ROUTES = {
  ROOT: '/admin/admin_system/system_bulk_import',
} as const;

export const ADMIN_SYSTEM_BULK_IMPORT_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/system',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SYSTEM_BULK_IMPORT_CANONICAL_ROUTE = ADMIN_SYSTEM_BULK_IMPORT_ROUTES.ROOT;

export const ADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS = ['Name*', 'Phone*', 'Email', 'Shift*', 'Seat', 'Plan', 'Fee Paid', 'Join Date'] as const;

export const ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG: Record<AdminSystemBulkImportRowStatus, { label: string; variant: AdminSystemBulkImportadmin_system_bulk_import_constantsVariant; icon: LucideIcon }> = {
  ok: { label: 'OK', variant: 'success', icon: CheckCircle },
  warning: { label: 'Warning', variant: 'warning', icon: AlertTriangle },
  error: { label: 'Error', variant: 'danger', icon: XCircle },
};

export const ADMIN_SYSTEM_BULK_IMPORT_INSTRUCTION_ROWS = [
  { labelKey: 'NAME', required: true, example: 'Rahul Sharma' },
  { labelKey: 'PHONE', required: true, example: '9876543210' },
  { labelKey: 'EMAIL', required: false, example: 'rahul@gmail.com' },
  { labelKey: 'SHIFT', required: true, exampleKey: 'IMPORT_EXAMPLE_SHIFT_RANGE' },
  { labelKey: 'SEAT', required: false, example: 'S-01' },
  { labelKey: 'IMPORT_COLUMN_PLAN', required: false, exampleKey: 'IMPORT_EXAMPLE_PLAN_RANGE' },
  { labelKey: 'IMPORT_COLUMN_FEE_PAID', required: false, example: '1000' },
  { labelKey: 'IMPORT_COLUMN_JOIN_DATE', required: false, example: '2026-04-12' },
] as const;

export interface AdminSystemBulkImportStepperItem {
  id: AdminSystemBulkImportStep;
  labelKey: AdminSystemBulkImportStepperItemLabelKey;
  number: number;
}

export const ADMIN_SYSTEM_BULK_IMPORT_STEPS: readonly AdminSystemBulkImportStepperItem[] = [
  { id: 'upload', labelKey: 'IMPORT_STEP_UPLOAD', number: 1 },
  { id: 'preview', labelKey: 'IMPORT_STEP_REVIEW', number: 2 },
  { id: 'importing', labelKey: 'IMPORT_STEP_IMPORTING', number: 3 },
  { id: 'done', labelKey: 'IMPORT_STEP_COMPLETE', number: 4 },
];
