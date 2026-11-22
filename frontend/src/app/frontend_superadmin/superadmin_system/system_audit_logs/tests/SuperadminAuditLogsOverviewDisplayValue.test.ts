// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewDisplayValue.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { displayValue } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/utils/SuperadminAuditLogsOverviewDisplayValue';

describe('SuperadminAuditLogsDisplayValue', () => {
  it('uses an en dash for nullish and empty values', () => {
    expect(displayValue(null)).toBe('—');
    expect(displayValue(undefined)).toBe('—');
    expect(displayValue('')).toBe('—');
  });

  it('preserves meaningful falsey values', () => {
    expect(displayValue(0)).toBe(0);
    expect(displayValue(false)).toBe(false);
  });

  it('preserves non-empty display content', () => {
    expect(displayValue('active')).toBe('active');
  });
});
