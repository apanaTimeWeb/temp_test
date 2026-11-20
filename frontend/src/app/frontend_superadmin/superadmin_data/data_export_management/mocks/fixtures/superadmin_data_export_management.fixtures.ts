// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/mocks/fixtures/superadmin_data_export_management.fixtures.ts
/**
 * @file superadmin_data_export_management.fixtures.ts
 * @description Mock fixtures for Tenant & Branch Data Export Management.
 */

import type {
  ExportJobRecord,
  TenantOption,
  BranchOption,
  ExportManagementOverview,
} from '../../types/superadmin_data_export_management.types';

export const MOCK_EXPORT_OVERVIEW: ExportManagementOverview = {
  activeJobsCount: 1,
  completedTodayCount: 8,
  totalStorageUsedBytes: 42949672960, // 40 GB
  totalExportsGenerated: 194,
};

export const MOCK_EXPORT_TENANTS: TenantOption[] = [
  { id: 'tnt-delhi-central', name: 'Delhi Central Library', code: 'DCL-01', totalBranches: 4, recordCount: 184500 },
  { id: 'tnt-mumbai-suburb', name: 'Mumbai Metro Library Network', code: 'MML-02', totalBranches: 6, recordCount: 312000 },
  { id: 'tnt-bangalore-tech', name: 'Bengaluru Digital Learning Vault', code: 'BDL-03', totalBranches: 2, recordCount: 98000 },
];

export const MOCK_EXPORT_BRANCHES: BranchOption[] = [
  { id: 'br-dcl-north', tenantId: 'tnt-delhi-central', name: 'North Campus Branch', code: 'DCL-NC', recordCount: 82000 },
  { id: 'br-dcl-south', tenantId: 'tnt-delhi-central', name: 'South Extension Branch', code: 'DCL-SE', recordCount: 61500 },
  { id: 'br-dcl-central', tenantId: 'tnt-delhi-central', name: 'Connaught Place Main', code: 'DCL-CP', recordCount: 41000 },
  { id: 'br-mml-bandra', tenantId: 'tnt-mumbai-suburb', name: 'Bandra West Branch', code: 'MML-BW', recordCount: 120000 },
  { id: 'br-mml-andheri', tenantId: 'tnt-mumbai-suburb', name: 'Andheri Hub', code: 'MML-AH', recordCount: 192000 },
];

export const MOCK_EXPORT_JOBS: ExportJobRecord[] = [
  {
    id: 'exp-job-001',
    exportNumber: 'EXP-2026-11-20-001',
    scope: 'TENANT',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    branchId: null,
    branchName: null,
    format: 'ENCRYPTED_ZIP',
    entities: ['catalogs', 'patrons', 'circulations', 'financials'],
    sizeBytes: 421098400, // 401 MB
    sha256Checksum: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    downloadUrl: '/api/v1/superadmin/data/exports/jobs/exp-job-001/download',
    status: 'READY',
    progressPercent: 100,
    createdAt: '2026-11-20T10:15:00.000Z',
    expiresAt: '2026-11-27T10:15:00.000Z',
    requestedBy: 'superadmin@institution.edu',
  },
  {
    id: 'exp-job-002',
    exportNumber: 'EXP-2026-11-20-002',
    scope: 'BRANCH',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    branchId: 'br-dcl-north',
    branchName: 'North Campus Branch',
    format: 'CSV_ARCHIVE',
    entities: ['catalogs', 'patrons'],
    sizeBytes: null,
    sha256Checksum: null,
    downloadUrl: null,
    status: 'PROCESSING',
    progressPercent: 64,
    createdAt: '2026-11-20T17:45:00.000Z',
    expiresAt: '2026-11-27T17:45:00.000Z',
    requestedBy: 'superadmin@institution.edu',
  },
  {
    id: 'exp-job-003',
    exportNumber: 'EXP-2026-11-19-003',
    scope: 'TENANT',
    tenantId: 'tnt-mumbai-suburb',
    tenantName: 'Mumbai Metro Library Network',
    branchId: null,
    branchName: null,
    format: 'SQL_DUMP',
    entities: ['catalogs', 'patrons', 'circulations', 'financials', 'configurations'],
    sizeBytes: 1073741824, // 1 GB
    sha256Checksum: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    downloadUrl: '/api/v1/superadmin/data/exports/jobs/exp-job-003/download',
    status: 'READY',
    progressPercent: 100,
    createdAt: '2026-11-19T08:00:00.000Z',
    expiresAt: '2026-11-26T08:00:00.000Z',
    requestedBy: 'ops.lead@institution.edu',
  },
];
