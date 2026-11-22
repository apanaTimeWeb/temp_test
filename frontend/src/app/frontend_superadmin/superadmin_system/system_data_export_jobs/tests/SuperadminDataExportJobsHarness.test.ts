// RESPONSIBILITY: Define source-level test coverage for system data export jobs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_data_export_jobs/tests/SuperadminDataExportJobsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_ROUTES as __SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_ROUTES } from "@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/config/superadmin_data_export_jobs.url_config";
import { SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/api/superadmin_data_export_jobs.query_keys';

describe('data_export_jobs standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_ROUTES.SUPERADMIN_SYSTEM_DATA_EXPORT_URLS.PAGE).toBe('/superadmin/superadmin_system/data_export_jobs');
    expect(__SUPERADMIN_SYSTEM_DATA_EXPORT_JOBS_ROUTES.SUPERADMIN_SYSTEM_DATA_EXPORT_URLS.SCREEN).toBe("/superadmin/superadmin_system/data_export_jobs");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_DATA_EXPORT_JOBS_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_system", "data_export_jobs"]);
  });
});
