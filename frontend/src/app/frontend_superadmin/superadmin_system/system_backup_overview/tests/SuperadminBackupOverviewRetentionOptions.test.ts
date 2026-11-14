import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS as overview } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/constants/SuperadminBackupOverviewConstants';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS as createFlow } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/constants/SuperadminBackupOverviewCreateFlowConstants';

describe('backup overview retention options', () => {
  it('keeps the overview and create-flow controls aligned', () => {
    expect(overview).toEqual(createFlow);
    expect(overview.map(({ value }) => value)).toEqual(['7', '30', '90']);
  });
});
