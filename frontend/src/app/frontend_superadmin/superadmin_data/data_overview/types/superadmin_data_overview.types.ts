// types/superadmin_data_overview.types.ts
// Canonical TypeScript interfaces for Superadmin Data Overview

export interface SuperadminDataOverviewMetrics {
  platformDrScore: number; // 0 to 100
  activeSchedulesCount: number;
  totalSnapshotsCount: number;
  totalStorageUsedGb: number;
  storageQuotaGb: number;
  lastBackupTimestamp: string;
  lastRestoreDrillTimestamp: string;
  replicationHealth: 'OPTIMAL' | 'DEGRADED' | 'FAILED';
  tenantIsolationIntegrity: 'VERIFIED_100_PERCENT' | 'ATTENTION_REQUIRED';
}

export interface SuperadminDataOverviewRpoRtoStatus {
  targetRpoMinutes: number;
  currentRpoMinutes: number;
  rpoStatus: 'COMPLIANT' | 'BREACHED';
  targetRtoMinutes: number;
  testedRtoMinutes: number;
  rtoStatus: 'COMPLIANT' | 'BREACHED';
  lastDrillPassRate: number; // percentage e.g. 100
  nextScheduledDrill: string;
}

export interface SuperadminDataOverviewActivityItem {
  id: string;
  timestamp: string;
  type: 'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT' | 'ARCHIVE';
  title: string;
  details: string;
  tenantName?: string;
  status: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED';
  durationSeconds: number;
}

export interface SuperadminDataOverviewStorageCategory {
  category: string;
  sizeGb: number;
  percentage: number;
  colorHex: string;
}
