// constants/superadmin_data_backup_operations.constants.ts
// Canonical static constants for Superadmin Data Backup Operations

export const SUPERADMIN_BACKUP_FREQUENCIES = [
  { label: 'Hourly WAL Archive (Continuous)', value: 'HOURLY_WAL', cron: '0 * * * *' },
  { label: 'Daily Midnight Backup (00:00 UTC)', value: 'DAILY', cron: '0 0 * * *' },
  { label: 'Twice Daily (12-Hour Cycle)', value: 'TWICE_DAILY', cron: '0 0,12 * * *' },
  { label: 'Weekly Full Cold Archive (Sunday)', value: 'WEEKLY', cron: '0 2 * * 0' },
] as const;

export const SUPERADMIN_BACKUP_STORAGE_TARGETS = [
  { label: 'Dual-Region (AWS S3 us-east-1 + Cloudflare R2 eu-central)', value: 'DUAL_REGION' },
  { label: 'Primary Cloud Only (AWS S3 us-east-1)', value: 'PRIMARY_ONLY' },
  { label: 'Encrypted Cold Storage (AWS Glacier)', value: 'GLACIER_ARCHIVE' },
] as const;

export const SUPERADMIN_BACKUP_ENCRYPTION_STANDARDS = [
  { label: 'AES-256-GCM (Hardware Accelerated, Recommended)', value: 'AES_256_GCM' },
  { label: 'ChaCha20-Poly1305', value: 'CHACHA20' },
] as const;
