// mocks/fixtures/superadmin_data_overview.fixtures.ts
// Realistic mock fixtures for Superadmin Data Overview

import type {
  SuperadminDataOverviewMetrics,
  SuperadminDataOverviewRpoRtoStatus,
  SuperadminDataOverviewActivityItem,
  SuperadminDataOverviewStorageCategory,
} from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';

export const MOCK_SUPERADMIN_DATA_OVERVIEW_METRICS: SuperadminDataOverviewMetrics = {
  platformDrScore: 98,
  activeSchedulesCount: 4,
  totalSnapshotsCount: 142,
  totalStorageUsedGb: 418.5,
  storageQuotaGb: 1000.0,
  lastBackupTimestamp: 'Today at 00:00 UTC (14 mins ago)',
  lastRestoreDrillTimestamp: 'Yesterday at 18:30 UTC',
  replicationHealth: 'OPTIMAL',
  tenantIsolationIntegrity: 'VERIFIED_100_PERCENT',
};

export const MOCK_SUPERADMIN_DATA_OVERVIEW_RPO_RTO: SuperadminDataOverviewRpoRtoStatus = {
  targetRpoMinutes: 15,
  currentRpoMinutes: 4.2,
  rpoStatus: 'COMPLIANT',
  targetRtoMinutes: 30,
  testedRtoMinutes: 11.8,
  rtoStatus: 'COMPLIANT',
  lastDrillPassRate: 100,
  nextScheduledDrill: 'Tomorrow at 02:00 UTC',
};

export const MOCK_SUPERADMIN_DATA_OVERVIEW_ACTIVITIES: SuperadminDataOverviewActivityItem[] = [
  {
    id: 'act-101',
    timestamp: 'Today, 00:00 UTC',
    type: 'BACKUP',
    title: 'Automated Daily Snapshot (Dual-Region Sync)',
    details: 'PostgreSQL cluster + Cloudflare R2 binary blobs encrypted with AES-256-GCM',
    tenantName: 'Platform Global',
    status: 'SUCCESS',
    durationSeconds: 142,
  },
  {
    id: 'act-102',
    timestamp: 'Yesterday, 18:30 UTC',
    type: 'RESTORE',
    title: 'Weekly Automated Sandbox Restore Drill',
    details: 'Ephemeral isolated sandbox verified with 0% data corruption across 48 libraries',
    tenantName: 'Sandbox Drill #88',
    status: 'SUCCESS',
    durationSeconds: 708,
  },
  {
    id: 'act-103',
    timestamp: 'Yesterday, 14:15 UTC',
    type: 'EXPORT',
    title: 'Tenant Data Export: Apex Central Library',
    details: 'GDPR compliance archive with password encryption and checksum manifest',
    tenantName: 'Apex Central Library',
    status: 'SUCCESS',
    durationSeconds: 45,
  },
  {
    id: 'act-104',
    timestamp: '18 Nov 2026, 11:20 UTC',
    type: 'IMPORT',
    title: 'Migration Batch #12: Horizon Study Lounge',
    details: 'Pre-flight validation passed: 1,420 members, 350 seats imported with zero duplicates',
    tenantName: 'Horizon Study Lounge',
    status: 'SUCCESS',
    durationSeconds: 98,
  },
  {
    id: 'act-105',
    timestamp: '17 Nov 2026, 03:00 UTC',
    type: 'ARCHIVE',
    title: 'Retention Policy Auto-Purge: Expired Session Logs',
    details: 'Compressed and archived audit logs older than 365 days to AWS Glacier',
    tenantName: 'System Archive',
    status: 'SUCCESS',
    durationSeconds: 210,
  },
];

export const MOCK_SUPERADMIN_DATA_OVERVIEW_STORAGE: SuperadminDataOverviewStorageCategory[] = [
  { category: 'PostgreSQL Tenant Databases', sizeGb: 214.2, percentage: 51.2, colorHex: '#ec4899' },
  { category: 'Document & PDF Invoices', sizeGb: 112.5, percentage: 26.9, colorHex: '#38bdf8' },
  { category: 'WAL Archive Logs', sizeGb: 58.4, percentage: 14.0, colorHex: '#facc15' },
  { category: 'Cold Archive Snapshots', sizeGb: 33.4, percentage: 7.9, colorHex: '#a855f7' },
];
