import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS } from '@/app/frontend_superadmin/superadmin_system/system_backup_schedules/constants/SuperadminBackupSchedulesConstants';

describe('backup schedules retention options', () => {
  it('uses localized seven/thirty/ninety-day option keys', () => {
    expect(SUPERADMIN_BACKUP_RETENTION_OPTIONS.map(({ value }) => value)).toEqual(['7', '30', '90']);
    expect(SUPERADMIN_BACKUP_RETENTION_OPTIONS.map(({ labelKey }) => labelKey)).toEqual(['COPY.KEEP_LAST_7_DAYS', 'COPY.KEEP_LAST_30_DAYS', 'COPY.KEEP_LAST_90_DAYS']);
  });
});
