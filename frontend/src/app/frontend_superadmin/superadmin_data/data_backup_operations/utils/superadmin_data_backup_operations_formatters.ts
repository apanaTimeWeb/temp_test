// utils/superadmin_data_backup_operations_formatters.ts

export function formatFrequencyLabel(freq: string): string {
  switch (freq) {
    case 'HOURLY_WAL':
      return 'Hourly (WAL Stream)';
    case 'DAILY':
      return 'Daily at 00:00 UTC';
    case 'TWICE_DAILY':
      return 'Every 12 Hours';
    case 'WEEKLY':
      return 'Weekly (Sunday 02:00 UTC)';
    default:
      return freq;
  }
}

export function formatStorageTargetLabel(target: string): string {
  switch (target) {
    case 'DUAL_REGION':
      return 'Dual-Region (AWS + R2)';
    case 'PRIMARY_ONLY':
      return 'Primary S3';
    case 'GLACIER_ARCHIVE':
      return 'Glacier Cold Storage';
    default:
      return target;
  }
}

export function formatScopeLabel(scope: string): string {
  switch (scope) {
    case 'FULL_PLATFORM':
      return 'Complete Platform';
    case 'TENANT_DATABASES':
      return 'Tenant DBs Only';
    case 'BINARY_BLOBS':
      return 'Binary Blobs Only';
    default:
      return scope;
  }
}
