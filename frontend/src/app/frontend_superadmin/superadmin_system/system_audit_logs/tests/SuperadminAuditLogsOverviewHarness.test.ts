// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_AUDIT_LOGS_ROUTES as __SUPERADMIN_SYSTEM_AUDIT_LOGS_ROUTES } from "@/app/frontend_superadmin/superadmin_system/system_audit_logs/config/superadmin_audit_logs.url_config";
import { SUPERADMIN_AUDIT_LOGS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/api/superadmin_audit_logs.query_keys';

describe('audit_logs standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SYSTEM_AUDIT_LOGS_ROUTES.SUPERADMIN_AUDIT_LOGS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_system');
    expect(__SUPERADMIN_SYSTEM_AUDIT_LOGS_ROUTES.SUPERADMIN_AUDIT_LOGS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_system/audit_logs");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_AUDIT_LOGS_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_system", "audit_logs"]);
  });
});
