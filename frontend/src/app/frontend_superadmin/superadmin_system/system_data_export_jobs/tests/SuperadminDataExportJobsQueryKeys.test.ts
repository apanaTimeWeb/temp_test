// RESPONSIBILITY: Define source-level test coverage for system data export jobs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_data_export_jobs/tests/SuperadminDataExportJobsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS } from '../api/superadmin_data_export_jobs.query_keys';

describe('data_export_jobs canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_system', 'data_export_jobs']);
    expect(SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
