import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS as history } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/constants/SuperadminBackupHistoryConstants';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS as restore } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/constants/SuperadminBackupHistoryRestoreFlowConstants';

describe('backup history retention options', () => {
  it('shares the same seven/thirty/ninety-day options across both owned panels', () => {
    expect(history).toEqual(restore);
    expect(history.map(({ value }) => value)).toEqual(['7', '30', '90']);
  });
});
