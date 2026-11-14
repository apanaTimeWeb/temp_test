// RESPONSIBILITY: Define source-level test coverage for system backup schedules using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_schedules/tests/SuperadminBackupSchedulesQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS } from '../api/superadmin_backup_schedules.query_keys';

describe('backup_schedules canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_system', 'backup_schedules']);
    expect(SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_BACKUP_SCHEDULES_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
