// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_BACKUP_OVERVIEW_ROUTES as __SUPERADMIN_SYSTEM_BACKUP_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_system/system_backup_overview/config/superadmin_backup_overview.url_config";
import { SUPERADMIN_BACKUP_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/api/superadmin_backup_overview.query_keys';

describe('backup_overview standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SYSTEM_BACKUP_OVERVIEW_ROUTES.SUPERADMIN_BACKUP_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_system');
    expect(__SUPERADMIN_SYSTEM_BACKUP_OVERVIEW_ROUTES.SUPERADMIN_BACKUP_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_system/backup_overview");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_BACKUP_OVERVIEW_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_system", "backup_overview"]);
  });
});
