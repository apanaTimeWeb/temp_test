import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_PROVIDER_OPTIONS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants';
import { SUPERADMIN_SYSTEM_BACKUP_STATUS, SUPERADMIN_SYSTEM_BACKUP_STATUS_CONFIG } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationBackupConstants';

describe('backup configuration static UI contracts', () => {
  it('owns supported provider values and locale keys', () => {
    expect(SUPERADMIN_BACKUP_PROVIDER_OPTIONS.map(({ value }) => value)).toEqual(['Google Drive', 'AWS S3', 'Dropbox', 'Custom S3 Compatible']);
    expect(SUPERADMIN_BACKUP_PROVIDER_OPTIONS.every(({ labelKey }) => labelKey.startsWith('COPY.'))).toBe(true);
  });
  it('uses one canonical backup status registry for values and config', () => {
    expect(Object.values(SUPERADMIN_SYSTEM_BACKUP_STATUS)).toEqual(['success', 'failed', 'in-progress']);
    expect(Object.keys(SUPERADMIN_SYSTEM_BACKUP_STATUS_CONFIG)).toEqual(Object.values(SUPERADMIN_SYSTEM_BACKUP_STATUS));
  });
});
