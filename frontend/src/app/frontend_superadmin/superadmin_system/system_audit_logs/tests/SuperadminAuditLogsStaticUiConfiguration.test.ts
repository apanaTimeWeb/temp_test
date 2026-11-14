import { describe, expect, it } from 'vitest';
import { SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS, SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants';

describe('audit logs static UI configuration', () => {
  it('owns the supported page-size options in one constants module', () => {
    expect(SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS).toEqual([10, 25, 50]);
    expect(SUPERADMIN_AUDIT_LOGS_DEFAULT_PAGE_SIZE).toBe(SUPERADMIN_AUDIT_LOGS_PAGE_SIZE_OPTIONS[0]);
  });
});
