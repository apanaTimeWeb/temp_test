// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/types/superadmin_data_export_management.types.ts
/**
 * @file superadmin_data_export_management.types.ts
 * @description Types for Tenant Export, Branch Export, Export Queue, and Format contracts.
 */

import type {
  EXPORT_SCOPES,
  EXPORT_FORMATS,
  EXPORT_STATUS,
} from '@/app/frontend_superadmin/superadmin_data/data_export_management/constants/superadmin_data_export_management.constants';

export type ExportScope = keyof typeof EXPORT_SCOPES;
export type ExportFormat = keyof typeof EXPORT_FORMATS;
export type ExportStatus = keyof typeof EXPORT_STATUS;

export interface ExportJobRecord {
  id: string;
  exportNumber: string;
  scope: ExportScope;
  tenantId: string;
  tenantName: string;
  branchId?: string | null;
  branchName?: string | null;
  format: ExportFormat;
  entities: string[];
  sizeBytes: number | null;
  sha256Checksum: string | null;
  downloadUrl: string | null;
  status: ExportStatus;
  progressPercent: number;
  createdAt: string;
  expiresAt: string;
  requestedBy: string;
  errorMessage?: string | null;
}

export interface TenantOption {
  id: string;
  name: string;
  code: string;
  totalBranches: number;
  recordCount: number;
}

export interface BranchOption {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  recordCount: number;
}

export interface CreateExportPayload {
  scope: ExportScope;
  tenantId: string;
  branchId?: string | null;
  format: ExportFormat;
  entities: string[];
  encryptionPassword?: string | null;
  reason: string;
}

export interface ExportManagementOverview {
  activeJobsCount: number;
  completedTodayCount: number;
  totalStorageUsedBytes: number;
  totalExportsGenerated: number;
}
