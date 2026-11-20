// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/mocks/fixtures/superadmin_data_restore_operations.fixtures.ts
/**
 * @file superadmin_data_restore_operations.fixtures.ts
 * @description Standard fixtures for Backup History, Restore operations, and Sandbox Drill tests.
 */

import type {
  BackupSnapshotRecord,
  RestoreDrillRecord,
  RestoreOperationsOverview,
} from '../../types/superadmin_data_restore_operations.types';

export const MOCK_RESTORE_OVERVIEW: RestoreOperationsOverview = {
  totalSnapshots: 148,
  verifiedSnapshots: 142,
  lastDrillResult: {
    status: 'PASSED',
    simulatedRtoMinutes: 4.8,
    executedAt: '2026-11-18T03:30:00.000Z',
  },
  tenantIsolationGuarantee: true,
};

export const MOCK_SNAPSHOTS: BackupSnapshotRecord[] = [
  {
    id: 'snp-001',
    snapshotNumber: 'SNP-2026-11-20-001',
    scope: 'FULL',
    tenantId: null,
    tenantName: null,
    createdAt: '2026-11-20T02:00:00.000Z',
    sizeBytes: 15428912040, // ~14.37 GB
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    encryptionAlgorithm: 'AES-GCM-256',
    storageLocation: 's3://inst-dr-vault-primary/snapshots/snp-001.enc',
    verificationStatus: 'VERIFIED',
    lastDrillAt: '2026-11-20T04:15:00.000Z',
    retentionExpiresAt: '2027-11-20T00:00:00.000Z',
    metadata: {
      totalRecords: 14820990,
      databaseVersion: 'PostgreSQL 16.4',
      schemaMigrationVersion: 'v2.8.4',
    },
  },
  {
    id: 'snp-002',
    snapshotNumber: 'SNP-2026-11-19-002',
    scope: 'TENANT_ISOLATED',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    createdAt: '2026-11-19T14:30:00.000Z',
    sizeBytes: 421098400, // ~401 MB
    sha256Checksum: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    encryptionAlgorithm: 'AES-GCM-256',
    storageLocation: 's3://inst-dr-vault-primary/tenants/tnt-delhi-central/snp-002.enc',
    verificationStatus: 'VERIFIED',
    lastDrillAt: '2026-11-19T15:00:00.000Z',
    retentionExpiresAt: '2027-05-19T00:00:00.000Z',
    metadata: {
      totalRecords: 184500,
      databaseVersion: 'PostgreSQL 16.4',
      schemaMigrationVersion: 'v2.8.4',
    },
  },
  {
    id: 'snp-003',
    snapshotNumber: 'SNP-2026-11-18-003',
    scope: 'INCREMENTAL',
    tenantId: null,
    tenantName: null,
    createdAt: '2026-11-18T18:00:00.000Z',
    sizeBytes: 89012410, // ~84 MB
    sha256Checksum: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    encryptionAlgorithm: 'AES-GCM-256',
    storageLocation: 's3://inst-dr-vault-primary/snapshots/snp-003.enc',
    verificationStatus: 'UNTESTED',
    lastDrillAt: null,
    retentionExpiresAt: '2026-12-18T00:00:00.000Z',
    metadata: {
      totalRecords: 14200,
      databaseVersion: 'PostgreSQL 16.4',
      schemaMigrationVersion: 'v2.8.4',
    },
  },
];

export const MOCK_DRILL_HISTORY: RestoreDrillRecord[] = [
  {
    id: 'drill-001',
    snapshotId: 'snp-001',
    snapshotNumber: 'SNP-2026-11-20-001',
    executedAt: '2026-11-20T04:15:00.000Z',
    durationSeconds: 288,
    status: 'PASSED',
    simulatedRtoMinutes: 4.8,
    checksumMatch: true,
    tenantIsolationPass: true,
    notes: 'Weekly automated sandbox disaster drill completed. Full database restored in isolated VPC.',
    operatorId: 'system.dr-automation@platform',
  },
  {
    id: 'drill-002',
    snapshotId: 'snp-002',
    snapshotNumber: 'SNP-2026-11-19-002',
    executedAt: '2026-11-19T15:00:00.000Z',
    durationSeconds: 42,
    status: 'PASSED',
    simulatedRtoMinutes: 0.7,
    checksumMatch: true,
    tenantIsolationPass: true,
    notes: 'Tenant schema integrity verified. Zero cross-tenant foreign key leakage.',
    operatorId: 'superadmin.ops@platform',
  },
];
