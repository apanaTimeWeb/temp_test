// constants/superadmin_data_overview.constants.ts
// Canonical static constants for Superadmin Data Overview

export const SUPERADMIN_DATA_OVERVIEW_STATUS = {
  HEALTHY: 'HEALTHY',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  ACTIVE: 'ACTIVE',
  COMPLIANT: 'COMPLIANT',
} as const;

export const SUPERADMIN_DATA_OVERVIEW_DEFAULTS = {
  TARGET_RPO_MINUTES: 15,
  TARGET_RTO_MINUTES: 30,
  TOTAL_LIBRARIES: 48,
  TOTAL_BRANCHES: 132,
  LAST_SUCCESSFUL_BACKUP: '12 minutes ago',
  LAST_RESTORE_DRILL: '2 days ago',
  CLOUD_STORAGE_USED_GB: 418.5,
  REPLICATION_STATUS: 'Active Dual-Region Sync (AWS us-east-1 + Cloudflare R2 eu-central)',
} as const;
